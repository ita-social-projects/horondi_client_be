FROM node:14.15.4-alpine
VOLUME /sys/fs/cgroup
ARG password
ENV PYTHONUNBUFFERED=1
WORKDIR /usr/app
COPY package*.json ./

RUN apk add --update --no-cache python3 sudo openrc openssh bash \
    && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools \
    && mkdir /run/openrc/ && touch /run/openrc/softlevel \
    && mkdir -p /var/run/sshd \
    && mkdir -p /tmp \
    && echo "root:${password}" | chpasswd
    
RUN apk update && apk add --update nodejs nodejs-npm  && npm install
    
# RUN npm install -g npm@latest && npm install --save --legacy-peer-deps
COPY . .

COPY ./sshd_config /etc/ssh/
COPY ./ssh_setup.sh /tmp

RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null) \
    && rc-update add sshd \
    && rc-status \
    && rc-service sshd restart
EXPOSE 80 2222
CMD /usr/sbin/sshd && npm start
