import { ForbiddenError, SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

import { NOT_AUTHORIZED } from '#config/constants';

export class isAuthenticatedDirective extends SchemaDirectiveVisitor {
  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;

    // eslint-disable-next-line no-param-reassign, func-names
    field.resolve = async function (...args) {
      const context = args[2];
      const user = context?.userId;

      if (!user) throw new ForbiddenError(NOT_AUTHORIZED);

      const data = await resolve.apply(this, args);

      return data;
    };
  }
}
