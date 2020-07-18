FROM node:12.18-alpine

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

ENV NODE_ENV production

COPY --chown=node package*.json ./

RUN npm ci

COPY --chown=node . .

RUN npm install --dev && npm run build

CMD [ "npm", "start" ]


