import graphqlFields from 'graphql-fields';

// Generate select string for better performance.
const selectedFields = (info, includeFields = [], ignoredFields = []) => {
  const fields = graphqlFields(
    info,
    { _id: 1 },
    { excludedFields: ['__typename', ...ignoredFields] }
  );

  const selected = [...Object.keys(fields), ...includeFields];

  return selected.join(' ');
};

export { selectedFields };
