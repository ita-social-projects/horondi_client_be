FROM node:14.15.4-alpine3.10
WORKDIR /usr/app
COPY package*.json ./
RUN npm install && npm install @szmarczak/http-timer
COPY . .
CMD ["npm", "start"]