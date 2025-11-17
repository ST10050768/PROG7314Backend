const deleteUser = jest.fn();

const auth = jest.fn(() => ({
  deleteUser,
}));

module.exports = {
  auth,
  deleteUser,
};

/*
Code Attribution
Code from Jest
Link: https://jestjs.io/docs/mock-functions
Accessed: 6 October 2025
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
}; */