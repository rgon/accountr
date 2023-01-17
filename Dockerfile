# -- Source build
FROM node:19.2-alpine AS build
RUN npm install -g npm@9.1.3

WORKDIR /app
COPY ["package.json", "package-lock.json", "/app/"]
RUN npm ci
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN npm run build

# -- Serve
FROM node:19.2-alpine AS deploy

WORKDIR /app
COPY --from=build /app/node_modules node_modules/
COPY --from=build /app/build ./build
COPY package.json .
COPY serve.mjs .

EXPOSE 3000
ENV NODE_ENV=production
CMD node serve.mjs