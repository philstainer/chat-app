import { isAuthenticatedDirective } from '#graphql/directives/isAuthenticatedDirective';
import { isGuestDirective } from '#graphql/directives/isGuestDirective';

export const schemaDirectives = {
  isAuthenticated: isAuthenticatedDirective,
  isGuest: isGuestDirective,
};
