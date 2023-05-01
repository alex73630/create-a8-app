FROM node:18-alpine as base

FROM base as deps

ENV CI true
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps as builder

WORKDIR /app
COPY . .
RUN npm run build

FROM base as runner

WORKDIR /app
RUN chown -R node:node /app && \
	chmod -R 770 /app
ENV NODE_ENV production
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/main"]