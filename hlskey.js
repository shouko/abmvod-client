/* eslint-disable no-bitwise */
/* global BigInt */
const crypto = require('crypto');
const config = require('./config');
const fetch = require('./fetch');

const getVideoKey = (cid, k, deviceId) => {
  const res = k
    .split('')
    .map((e, i) => BigInt(config.get('STRTABLE').indexOf(e)) * (BigInt(58) ** BigInt(k.length - 1 - i)))
    .reduce((a, b) => a + b, BigInt(0));
  const cipherVideoKey = Buffer.from(res.toString(16), 'hex');

  const h = crypto.createHmac('sha256', Buffer.from(config.get('HKEY'), 'hex'));
  h.update(`${cid}${deviceId}`);
  const key = h.digest();

  const decipher = crypto.createDecipheriv('aes-256-ecb', key, new Uint8Array(0))
    .setAutoPadding(false);

  return Buffer.concat([decipher.update(cipherVideoKey), decipher.final()]);
};

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
  if (!token) throw new Error('Failed to get MEDIATOKEN');
  const { cid, k } = await fetch(`${config.get('_LICENSE_API')}?t=${token}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      kv: 'a',
      lt: id,
    }),
  });

  return getVideoKey(cid, k, deviceId);
};

module.exports = {
  getKeyFromId,
};
