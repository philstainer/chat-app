FROM node:15-alpine3.12

WORKDIR /app/backend

COPY package*.json yarn.lock ./

RUN yarn install --silent

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
