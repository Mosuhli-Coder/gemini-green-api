import { login } from './authController';

// Mocking required functions and objects
const req = { body: { email: "user@example.com", password: "password123" } };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();
const User = {
  findOne: jest.fn().mockResolvedValue({ email: "user@example.com", password: "hashedPassword" }),
};
const bcryptjs = {
  compare: jest.fn().mockResolvedValue(true),
};
const jwt = {
  sign: jest.fn().mockReturnValue("jwt-token"),
};

// Test for successful login
test('Login - Successful Login', async () => {
  await login(req, res, next);
  expect(res.status).toHaveBeenCalledWith(200); // Expect response status to be 200
  expect(res.json).toHaveBeenCalledWith({ token: "jwt-token" }); // Expect response json to have token
});

// Test for incorrect password
test('Login - Incorrect Password', async () => {
  User.findOne.mockResolvedValueOnce({ email: "user@example.com", password: "wrongPassword" });
  await login(req, res, next);
  expect(next).toHaveBeenCalledWith(errorHandler(401, "Incorrect password")); // Expect next to be called with specific error
});

// Test for missing email
test('Login - Missing Email', async () => {
  const invalidReq = { body: { password: "password123" } };
  await login(invalidReq, res, next);
  expect(next).toHaveBeenCalledWith(errorHandler(400, "Email is required")); // Expect next to be called with specific error
});