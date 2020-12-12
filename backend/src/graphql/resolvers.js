import { userResolver } from '#graphql/user/user.resolver';
import { chatResolver } from '#graphql/chat/chat.resolver';
import { messageResolver } from '#graphql/message/message.resolver';

const resolvers = [userResolver, chatResolver, messageResolver];

export { resolvers };
