import { userResolver } from './user/user.resolver';
import { chatResolver } from './chat/chat.resolver';
import { messageResolver } from './message/message.resolver';

const resolvers = [userResolver, chatResolver, messageResolver];

export { resolvers };
