FROM node:14-alpine3.15
WORKDIR /usr/app
COPY . .
RUN apk add g++ make py3-pip libsecret-dev \
    && npm install --save --legacy-peer-deps

EXPOSE 80 2222
CMD ["npm", "start"]
