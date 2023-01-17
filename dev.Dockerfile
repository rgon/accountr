# -- Source build
#FROM node:19.2-alpine AS build

#RUN apk add git
#WORKDIR /app
#COPY package.json .
#RUN npm install

FROM node:19.2-alpine AS run
# RUN npm install -g npm@9.1.3
VOLUME /app
WORKDIR /app
#RUN npm install

EXPOSE 4873
CMD ["npm", "run", "dev", "--", "--host"]