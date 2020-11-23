const axios = require('axios');
const PORT = process.env.port | 8080;

test('Test started', () => {
  console.log(PORT);
  expect(1).toBe(1);
});

test("another test", () => {
  return undefined;
})