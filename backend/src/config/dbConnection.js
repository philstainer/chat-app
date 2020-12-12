import mongoose from 'mongoose';

import { accessEnv } from '../utils/accessEnv';

if (accessEnv('NODE_ENV') === 'development') mongoose.set('debug', true);

const connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  await mongoose.connect(accessEnv('MONGO_URI'), options);
};

const close = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clear = async () => {
  const { collections } = mongoose.connection;

  Object.keys(collections).map(async key => {
    await collections[key].deleteMany();
  });
};

export const db = { connect, close, clear };
