const supabase = require('../client/SupabaseClient');
const admin = require('../client/firebase-admin');

// Create or reuse a thread between a customer and provider
exports.createThread = async (req, res) => {
  const { customerId, providerId } = req.body;
  if (!customerId || !providerId) {
    console.error('Missing customerId or providerId');
    return res.status(400).json({ error: 'customerId and providerId are required' });
  }

  console.log('Checking for existing thread:', { customerId, providerId });

  const { data: existingThread, error: lookupError } = await supabase
    .from('MessageThread')
    .select('*')
    .eq('CustomerID', customerId)
    .eq('ProviderID', providerId)
    .maybeSingle();

  if (lookupError) {
    console.error('Thread lookup failed:', lookupError.message);
    return res.status(500).json({ error: lookupError.message });
  }

  if (existingThread) {
    console.log('Reusing existing thread:', existingThread.id);
    return res.status(200).json(existingThread);
  }

  console.log('No thread found. Creating new one.');

  const { data: newThread, error: insertError } = await supabase
    .from('MessageThread')
    .insert([{ CustomerID: customerId, ProviderID: providerId }])
    .select()
    .single();

  if (insertError) {
    console.error('Thread creation failed:', insertError.message);
    return res.status(400).json({ error: insertError.message });
  }

  console.log('New thread created:', newThread.id);
  res.status(200).json(newThread);
};

// Get all messages for a thread
exports.getMessages = async (req, res) => {
  const { threadId } = req.params;
  console.log('Fetching messages for thread:', threadId);

  const { data, error } = await supabase
    .from('Message')
    .select('*')
    .eq('ThreadID', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Fetch messages failed:', error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log(`Retrieved ${data.length} messages`);
  res.json(data);
};

// Send a message and push notification
exports.sendMessage = async (req, res) => {
  const { threadId, senderType, senderId, content } = req.body;

  if (!threadId || !senderType || !senderId || !content) {
    console.error('Missing required fields:', { threadId, senderType, senderId, content });
    return res.status(400).json({ error: 'threadId, senderType, senderId, and content are required' });
  }

  console.log('Sending message:', { threadId, senderType, senderId, content });

  const { data: messageData, error: insertError } = await supabase
    .from('Message')
    .insert([{ ThreadID: threadId, SenderType: senderType, SenderID: senderId, Content: content }])
    .select()
    .single();

  if (insertError) {
    console.error('Message insert failed:', insertError.message);
    return res.status(400).json({ error: insertError.message });
  }

  console.log('Message inserted:', messageData);

  const { data: thread, error: threadError } = await supabase
    .from('MessageThread')
    .select('*')
    .eq('id', threadId)
    .single();

  if (!thread) {
    console.error('Thread not found:', threadId);
    return res.status(404).json({ error: 'Thread not found' });
  }

  const recipientId = senderType === 'Customer' ? thread.ProviderID : thread.CustomerID;
  console.log('Recipient determined:', { senderType, recipientId });

  let profileUrl = '';
  if (senderType === 'Provider') {
    const { data: providerData } = await supabase
      .from('Provider')
      .select('ProfileUrl')
      .eq('id', senderId)
      .single();
    profileUrl = providerData?.ProfileUrl || '';
  }

  let providerName = 'Provider';
  let customerName = 'Customer';

  const [{ data: providerInfo }, { data: customerInfo }] = await Promise.all([
    thread.ProviderID
      ? supabase.from('Provider').select('FullName').eq('id', thread.ProviderID).single()
      : { data: null },
    thread.CustomerID
      ? supabase.from('Customer').select('FullName').eq('id', thread.CustomerID).single()
      : { data: null }
  ]);

  if (providerInfo?.FullName) providerName = providerInfo.FullName;
  if (customerInfo?.FullName) customerName = customerInfo.FullName;

  const { data: tokens, error: tokenError } = await supabase
    .from('DeviceToken')
    .select('Token')
    .eq('UserID', recipientId);

  if (tokenError) {
    console.error('Token lookup failed:', tokenError.message);
  } else if (!tokens || tokens.length === 0) {
    console.warn('No FCM token found for recipient:', recipientId);
  } else {
    const token = tokens[0].Token;
    console.log('Found FCM token:', token);

    const displayName = senderType === 'Provider' ? providerName : customerName;

    const message = {
  notification: {
    title: `New message from ${displayName}`,
    body: content
  },
  data: {
    title: `New message from ${displayName}`,
    body: content,
    threadId: String(threadId),
    senderId: String(senderId),
    senderType: String(senderType),
    providerName: providerName,
    content: String(content),
    profileUrl: profileUrl
  },
  android: {
    priority: 'high'
  },
  token
};

    console.log('Sending FCM message payload:', message);

    try {
      const response = await admin.messaging().send(message);
      console.log('FCM push success:', response);
    } catch (pushError) {
      console.error('FCM push failed:', pushError);

      if (pushError.errorInfo?.code === 'messaging/registration-token-not-registered') 
        {
        console.warn('Token invalid, deleting from Supabase:', token);
        await supabase.from('DeviceToken').delete().eq('Token', token);
        }
      }
    }

  res.json(messageData);
};

// Mark a message as seen
exports.markMessageSeen = async (req, res) => {
  const { messageId } = req.params;
  console.log('Marking message as seen:', messageId);

  const { data, error } = await supabase
    .from('Message')
    .update({ Seen: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    console.error('Mark message seen failed:', error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log('Message marked as seen:', data);
  res.json(data);
};
