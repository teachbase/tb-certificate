FROM node:15.14.0-alpine3.10

WORKDIR /tb_certificate

COPY . .

RUN yarn install && yarn build

EXPOSE 8080

CMD [ "yarn", "run", "prod" ]
