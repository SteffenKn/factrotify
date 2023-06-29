FROM node:lts-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/app

COPY --chown=node:node . package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

USER node
CMD ["dumb-init", "node", "dist/index.js"]
