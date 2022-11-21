FROM node:14.15.4-alpine
VOLUME /sys/fs/cgroup

ARG UID=1000
ARG GID=1000
ARG password

RUN groupmod -g "${GID}" node && usermod -u "${UID}" -g "${GID}" node
USER node

WORKDIR /usr/app

COPY --chown=node:node package*.json ./

RUN npm install -g npm@latest && npm install --save --legacy-peer-deps

COPY --chown=node:node . .

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
