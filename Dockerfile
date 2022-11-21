FROM node:14.15.4-alpine
VOLUME /sys/fs/cgroup
ARG password

WORKDIR /usr/app
COPY package*.json ./
RUN apk add shadow \
    && groupadd -g 45417732 node-app && useradd -r -u 71832246 -g node-app node-app
    && npm install -g npm@latest && npm install --save --legacy-peer-deps
COPY . .

RUN apk add --update --no-cache sudo openrc openssh bash \
    && mkdir /run/openrc/ && touch /run/openrc/softlevel \
    && mkdir -p /var/run/sshd \
    && mkdir -p /tmp \
    && echo "root:${password}" | chpasswd \
    && chown node-app:node-app -R /usr/app/node_modules/buffer-equal-constant-time/

COPY ./sshd_config /etc/ssh/
COPY ./ssh_setup.sh /tmp

RUN chmod +x /tmp/ssh_setup.sh \
    && (sleep 1;/tmp/ssh_setup.sh 2>&1 > /dev/null) \
    && rc-update add sshd \
    && rc-status \
    && rc-service sshd restart

EXPOSE 80 2222
CMD /usr/sbin/sshd && npm start
