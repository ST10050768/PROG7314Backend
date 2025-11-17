const admin = require('firebase-admin');
const serviceAccount = require('../prog7314poe-firebase-adminsdk-fbsvc-22ecf7e4af.json');

console.log("Using Firebase key:", serviceAccount.private_key_id);

// Prevent crash when admin.apps is undefined during mocking
if (!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
