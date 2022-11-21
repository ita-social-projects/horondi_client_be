FROM node:14.15.4-alpine
VOLUME /sys/fs/cgroup
ARG password

WORKDIR /usr/app
COPY package*.json ./
RUN npm install -g npm@latest
COPY . .

RUN apk add --update --no-cache sudo openrc openssh bash \
    && mkdir /run/openrc/ && touch /run/openrc/softlevel \
    && mkdir -p /var/run/sshd \
    && mkdir -p /tmp \
    && echo "root:${password}" | chpasswd

COPY ./sshd_config /etc/ssh/
COPY ./ssh_setup.sh /tmp

RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null) \
    && rc-update add sshd \
    && rc-status \
    && rc-service sshd restart

EXPOSE 80 2222
CMD /usr/sbin/sshd && npm start
