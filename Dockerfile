FROM node:alpine

WORKDIR /usr/app
COPY startup.sh ./
COPY package*.json ./
RUN npm install
RUN npm install @szmarczak/http-timer
COPY . .
CMD ["npm", "start"]
