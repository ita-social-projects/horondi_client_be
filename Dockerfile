FROM node:14.15.4-alpine3.10
WORKDIR /usr/app
COPY package*.json ./
RUN npm install -g npm@latest && npm install --save --legacy-peer-deps
COPY . .
CMD ["npm", "start"]
