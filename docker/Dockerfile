FROM node:10.16.0

WORKDIR /app
COPY app-build/package.json /app
COPY app-build/yarn.lock /app

RUN yarn

COPY app-build /app
