const fetch = require('node-fetch');

const UA_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36';

module.exports = async (uri, options) => fetch(uri, {
  ...options,
  headers: {
    ...(options.headers || {}),
    'User-Agent': UA_CHROME,
  },
}).then((res) => res.json());
