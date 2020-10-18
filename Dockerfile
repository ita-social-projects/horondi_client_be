FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install @szmarczak/http-timer
COPY . .

CMD ["npm", "start"]
EXPOSE 2222 80
