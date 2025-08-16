FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
RUN ls -la


FROM nginx:latest as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/build ./build/
COPY --from=builder /app/nginx /etc/nginx

ENTRYPOINT [ "npm", "run", "start:prod" ]

EXPOSE 3000
