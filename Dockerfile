FROM node:alpine
RUN apk add openssh \
     && echo "root:Docker!" | chpasswd
EXPOSE 80 2222
COPY sshd_config /etc/ssh/
WORKDIR /usr/app
COPY startup.sh ./
COPY package*.json ./
RUN npm install
RUN npm install @szmarczak/http-timer
COPY . .
RUN chmod +x startup.sh
RUN /usr/bin/ssh-keygen -A
RUN  ./startup.sh
CMD ["npm", "start"]
