FROM node:12.18-alpine

RUN npm install -g rollup sirv-cli

RUN mkdir -p /app

WORKDIR /app

ENV NODE_ENV production

COPY . .

RUN npm install && npm run build

EXPOSE 5000

ENV HOST=0.0.0.0

CMD [ "npm", "start" ]

