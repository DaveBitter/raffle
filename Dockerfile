FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn next:build
EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]