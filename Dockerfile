FROM node:14.15.4-alpine3.10
WORKDIR /usr/app
COPY package.json ./
RUN npm install -g npm@latest && npm install
COPY . .
CMD ["npm", "start"]