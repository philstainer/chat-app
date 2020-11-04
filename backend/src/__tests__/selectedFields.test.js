import graphqlFields from 'graphql-fields';

import { selectedFields } from '../utils/selectedFields';

jest.mock('graphql-fields');

test('should return a list of selected fields', () => {
  const fields = { _id: {}, email: {}, name: {} };
  graphqlFields.mockImplementation(() => fields);

  const expected = Object.keys(fields).join(' ');
  expect(selectedFields()).toEqual(expected);
});

test('should always return _id and ignore __typename', () => {
  const fields = { _id: {}, email: {}, name: {} };

  const fieldsMock = jest.fn(() => fields);
  graphqlFields.mockImplementation(fieldsMock);

  selectedFields({ info: 'select' });

  expect(fieldsMock).toHaveBeenCalledWith(
    { info: 'select' },
    { _id: 1 },
    { excludedFields: ['__typename'] }
  );
});

test('should include fields', () => {
  const fields = { _id: {}, email: {}, name: {} };

  const fieldsMock = jest.fn(() => fields);
  graphqlFields.mockImplementation(fieldsMock);

  const returnedFields = selectedFields({ info: 'select' }, ['age']);

  expect(returnedFields).toContain('age');
});

test('should exclude fields', () => {
  const fields = { _id: {}, email: {}, name: {} };

  const fieldsMock = jest.fn(() => fields);
  graphqlFields.mockImplementation(fieldsMock);

  const ignoredFields = ['name'];

  selectedFields({}, undefined, ignoredFields);

  expect(fieldsMock).toHaveBeenCalledWith(
    {},
    { _id: 1 },
    { excludedFields: ['__typename', ...ignoredFields] }
  );
});
