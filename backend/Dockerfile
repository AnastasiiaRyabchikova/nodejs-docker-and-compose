FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
RUN ls -la


FROM node:16-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
RUN ls -la .
COPY --from=builder /app/dist ./dist/
RUN ls -la

ENTRYPOINT [ "npm", "run", "start:prod" ]

EXPOSE 3000
