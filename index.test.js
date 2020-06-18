const { generateApplicationKeySecretTs } = require('./index');

describe('generateApplicationKeySecretTs', () => {
  it('Generates valid result', () => {
    const res = generateApplicationKeySecretTs('c44728a2-2234-4646-9d03-3fd4e7a579d8', '1592499600');
    expect(res).toEqual('n69_itiHxe3Vk1FrexrlMmsyunAc0cG6pOx5cxA8H5E');
  });
});
