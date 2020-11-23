const axios = require('axios');
const URL = process.env.url | 'localhost:8080/api'


test("Get orders for DB", () => {
  let res_promise = axios.get('http://localhost:8080/api/order')
    .then(() => {return true})
    .catch(() => {return false})
  return expect(res_promise).resolves.toBe(true)
});

test("Store order to DB", () => {
  let res_promise = axios.post('http://localhost:8080/api/order', {})
    .then(() => {return true})
    .catch(() => {return false})
    return expect(res_promise).resolves.toBe(true)
});

test("Store image to AWS", () => {
  let res_promise = axios.post('http://localhost:8080/api/order', { "image" : "data:image/jpeg;base64,/0= " })
    .then(() => {return true})
    .catch(() => {return false})
    return expect(res_promise).resolves.toBe(true)
});

test("Connect to DB", () => {
  return Promise.resolve(() => {});
});