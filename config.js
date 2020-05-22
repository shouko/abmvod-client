const store = new Map();

const get = (key) => store.get(key);

const set = (k, v) => {
  if (['string', 'number'].includes(typeof k)) {
    store.set(k, v);
  } else if (k) {
    const payload = k;
    Object.entries(payload).forEach(([key, value]) => {
      store.set(key, value);
    });
  }
};

module.exports = {
  get,
  set,
};
