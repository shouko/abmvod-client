const uuid4 = require('uuid').v4;
const crypto = require('crypto');
const config = require('./config');
const fetch = require('./fetch');
const hlskey = require('./hlskey');
require('dotenv').config();

const confKeys = ['HKEY', 'STRTABLE', 'SECRETKEY', '_MEDIATOKEN_API', '_USER_API', '_LICENSE_API'];

confKeys.forEach((k) => {
  config.set(k, process.env[k]);
});

const createHmacInstance = () => crypto.createHmac('sha256', config.get('SECRETKEY'));

const base64Url = (input) => {
  const buff = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buff.toString('base64').replace(/\+/g, '/').replace(/\//g, '_').replace(/=+$/, '');
};

const hmacMultiPass = (input, pass) => {
  let tmp = input;
  for (let i = 0; i < pass; i += 1) {
    const h = createHmacInstance();
    h.update(tmp);
    tmp = h.digest();
  }
  return tmp;
};

const generateApplicationKeySecret = (deviceId) => {
  const tsCeilingToHour = ((Date.now() / 1000 + 3600) / 3600) * 3600;
  const date = new Date(tsCeilingToHour * 1000);
  const timestampCeilingToHourString = Number.parseInt(tsCeilingToHour, 10).toString(10);
  let tmp = hmacMultiPass(config.get('SECRETKEY'), 1);
  tmp = hmacMultiPass(tmp, date.getUTCMonth() + 1);
  tmp = hmacMultiPass(base64Url(tmp) + deviceId, 1);
  tmp = hmacMultiPass(tmp, date.getUTCDate() % 5);
  tmp = hmacMultiPass(base64Url(tmp) + timestampCeilingToHourString);
  tmp = hmacMultiPass(tmp, date.getUTCHours() % 5);
  return base64Url(tmp);
};

const getKeyFromId = async (id) => {
  const deviceId = uuid4();
  const applicationKeySecret = generateApplicationKeySecret(deviceId);
  const tres = await fetch(`${config.get('_USER_API')}`, {
    method: 'POST',
    body: {
      deviceId,
      applicationKeySecret,
    },
  });
  const { token } = tres;
  return hlskey.getKeyFromId(id, token, deviceId);
};

module.exports = {
  getKeyFromId,
};
