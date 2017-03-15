FROM node:latest

MAINTAINER labriko@yandex.ru

WORKDIR /tmp
ADD package.json /tmp/package.json
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN mkdir -p /usr/src/app
RUN cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app

ADD . /usr/src/app

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "prod" ]
