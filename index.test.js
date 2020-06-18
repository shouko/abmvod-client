const { generateApplicationKeySecretTs } = require('./index');

describe('generateApplicationKeySecretTs', () => {
  it('Generates valid result', () => {
    const ts = 1592499600;
    const input = [
      'c44728a2-2234-4646-9d03-3fd4e7a579d8',
      '598fa05a-9928-4416-b4bc-ce6aece19ccd',
      '554f6bab-ba6b-43ee-96aa-952798bf0426',
      '6a5b02b8-d313-4f11-9446-f3a0f73d479a',
      '02c173b4-82ae-4783-9fee-2d1b95803c74',
      'c2863454-35f8-4097-9a5d-fdd9ca83e978',
      '29dcd84b-f95c-4de2-ad54-047fd497e7f7',
      '9137dca0-9c32-42f1-bff5-9a152ab7c64e',
      'b5916b23-98c2-4da4-87c2-381d8313a730',
      '58db2505-9314-44a5-a79b-e3cdeb8de642',
      'aec77c7f-89ff-433c-b1f5-03d09825d86f',
    ];
    const output = [
      'n69_itiHxe3Vk1FrexrlMmsyunAc0cG6pOx5cxA8H5E',
      'DQ-9SuIbfhCUap75TwvMfQPHRJ_Py7yZl30qNsfIJ2c',
      'Vct5y6nbXrSJfNkECWzSw7GyeVOWhbRGlc0Ujxjl9Vg',
      '0BTf8ACpOxg9VCBDQpOvy3KM-37b86KsoIB_aQg2KHg',
      '0MuMIbSj91-s3NbLTHfEisG-zuZrg7sed-dE6pKCNsA',
      '6X7Jlplp-O23Y0Dgz2Asis5ZDvsawwIB9Qp0oxxvRuA',
      'rBXFWA7wil9_-zUjtFb2BnEQiAovQQXPKAQe9nvtKwQ',
      '8iyF5QISNAMEi0svcNKEKPeVVPK6KxCiavRF_MvKkZ0',
      '3JuWDwOxyKFEHp9MbI5_lNbzCPgJ7-kJ8QXy_jODRbA',
      'bN1CorFVlrEr92Jp2ahSSDslmRjgpSYfHDe9oboMI6w',
      'XUae2yRdro1RUHdCGrrpUjEr1Zbg-A3rH6oIWzS97Dc',
    ];

    for (let i = 0; i < input.length; i += 1) {
      const res = generateApplicationKeySecretTs(input[i], ts);
      expect(res).toEqual(output[i]);
    }
  });
});
