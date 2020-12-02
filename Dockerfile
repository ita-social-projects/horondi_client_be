FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install && npm install @szmarczak/http-timer
COPY . .
CMD ["npm", "start"]