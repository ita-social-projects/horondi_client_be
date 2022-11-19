FROM node:14.15.4-alpine
VOLUME /sys/fs/cgroup
WORKDIR /usr/app
COPY package*.json ./
RUN npm install -g npm@latest && npm install --save --legacy-peer-deps
COPY . .
ARG password
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
    && rc-service sshd restart \
    && chown -R root /usr/app/node_modules/buffer-equal-constant-time/
EXPOSE 80 2222
CMD /usr/sbin/sshd && npm start
