FROM node:alpine
RUN apk add openssh \
     && echo "root:Docker!" | chpasswd 
COPY sshd_config /etc/ssh/
WORKDIR /usr/app

COPY package*.json ./
RUN npm install
RUN npm install @szmarczak/http-timer
COPY . .

CMD ["npm", "start"]
EXPOSE 2222 80
RUN /usr/sbin/sshd -p 2222
