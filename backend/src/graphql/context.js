export const context = ({ connection, ...ctx }) => {
  if (connection) return connection.context;

  return { ...ctx };
};
