module.exports = {
  from: jest.fn(() => ({
    insert: jest.fn(),
    select: jest.fn(),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    eq: jest.fn(),
    upsert: jest.fn(),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(),
    })),

  })),
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