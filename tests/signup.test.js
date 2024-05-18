// Mocking required functions and objects
const req = { body: { firstName: "John", lastName: "Doe", username: "johndoe", email: "john@example.com", password: "password123", confirmPassword: "password123" } };
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const next = jest.fn();
const User = {
  findOne: jest.fn(),
  save: jest.fn(),
};
const bcryptjs = {
  genSalt: jest.fn().mockResolvedValue("somesalt"),
  hashSync: jest.fn().mockReturnValue("hashedPassword"),
};
const errorHandler = jest.fn();

// Test for matching passwords
test('Signup - Passwords Match', async () => {
  const { signup } = require('../controllers/authController'); // Importing the function to test
  await signup(req, res, next);
  expect(next).not.toHaveBeenCalled(); // Expect next to not have been called
});

// Test for existing user with the same email
test('Signup - Existing Email', async () => {
  User.findOne.mockReturnValueOnce({ email: "john@example.com" }); // Mocking the User.findOne to return an existing user
  const { signup } = require('./controllers/authController');
  await signup(req, res, next);
  expect(next).toHaveBeenCalledWith(errorHandler(400, "User already exists")); // Expect next to be called with the specific error
});

// Test for existing user with the same username
test('Signup - Existing Username', async () => {
  User.findOne.mockReturnValueOnce(null).mockReturnValueOnce({ username: "johndoe" }); // Mocking User.findOne to return null and then an existing user
  const { signup } = require('./controllers/authController');
  await signup(req, res, next);
  expect(next).toHaveBeenCalledWith(errorHandler(400, "Username already exists")); // Expect next to be called with the specific error
});

// Test for successful user creation
test('Signup - Successful User Creation', async () => {
  User.findOne.mockReturnValueOnce(null).mockReturnValueOnce(null); // Mocking User.findOne to return null for both email and username
  User.save.mockResolvedValueOnce({ firstName: "John", lastName: "Doe", username: "johndoe", email: "john@example.com" }); // Mocking User.save to return the saved user
  const { signup } = require('./controllers/authController');
  await signup(req, res, next);
  expect(res.status).toHaveBeenCalledWith(201); // Expect response status to be 201
  expect(res.json).toHaveBeenCalledWith({ message: "User created successfully", data: expect.any(Object) }); // Expect response json to have specific message and data
});