import { register } from '#graphql/user/resolvers/register';
import { resetPasswordRequest } from '#graphql/user/resolvers/resetPasswordRequest';
import { login } from '#graphql/user/resolvers/login';
import { logout } from '#graphql/user/resolvers/logout';
import { confirmAccount } from '#graphql/user/resolvers/confirmAccount';
import { resetPassword } from '#graphql/user/resolvers/resetPassword';
import { me } from '#graphql/user/resolvers/me';
import { refreshTokens } from '#graphql/user/resolvers/refreshTokens';

const userResolver = {
  Query: {
    me,
    refreshTokens,
  },
  Mutation: {
    register,
    login,
    logout,
    confirmAccount,
    resetPasswordRequest,
    resetPassword,
  },
};

export { userResolver };
