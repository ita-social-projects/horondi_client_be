FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
RUN npm install @szmarczak/http-timer
COPY . .
EXPOSE 80
CMD ["npm", "start"]
