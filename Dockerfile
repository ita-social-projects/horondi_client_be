FROM node:14.15.3
WORKDIR /usr/app
COPY package*.json ./
RUN npm install -g npm@latest && npm install --save --legacy-peer-deps
COPY . .
ARG password
RUN apt-get update \
    && apt-get install -y openssh-server \
    && mkdir -p /var/run/sshd \
    && mkdir -p /tmp \
    && echo "root:${password}" | chpasswd 

COPY ./sshd_config /etc/ssh/
COPY ./ssh_setup.sh /tmp

RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null) \ 
    && service ssh restart
EXPOSE 80 2222
CMD /usr/sbin/sshd && npm start
