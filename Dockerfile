FROM node:20-slim
ARG NEXT_PUBLIC_CLIENT_URL=http://raffle.stevejonk.com/
ENV NEXT_PUBLIC_CLIENT_URL=$NEXT_PUBLIC_CLIENT_URL

ARG NEXT_PUBLIC_SERVER_URL=http://websocket.stevejonk.com/
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

WORKDIR /app
COPY package.json .
RUN yarn install

COPY . .
RUN yarn next:build

EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]