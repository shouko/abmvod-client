/* eslint-disable no-bitwise */
const crypto = require('crypto');
const struct = require('python-struct');
const config = require('./config');
const fetch = require('./fetch');

const getKeyFromId = async (id, userToken, deviceId) => {
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  const params = {
    osName: 'android',
    osVersion: '6.0.1',
    osLang: 'ja_JP',
    osTimezone: 'Asia/Tokyo',
    appId: 'tv.abema',
    appVersion: '3.27.1',
  };
  const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

  const { token } = await fetch(`${config.get('_MEDIATOKEN_API')}?${query}`, {
    method: 'GET',
    headers,
  });

  const { cid, k } = await fetch(`${config.get('_LICENSE_API')}?t=${token}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: {
      kv: 'a',
      lt: id,
    },
  });

  const res = k
    .map((e, i) => config.get('STRTABLE').indexOf(e) * (58 ** (k.length - 1 - i)))
    .reduce((a, b) => a + b, 0);

  const cipherVideoKey = struct.pack('>QQ', res >> 64, res & 0xffffffffffffffff);

  const h = crypto.createHmac('sha256', Buffer.from(config.get('HKEY'), 'hex'));
  h.update(`${cid}${deviceId}`);
  const key = h.digest();

  const decipher = crypto.createDecipher('aes-128-ecb', key);
  const plainVideoKey = decipher.update(cipherVideoKey, 'utf-8') + decipher.final('utf-8');

  return plainVideoKey;
};

module.exports = {
  getKeyFromId,
};
