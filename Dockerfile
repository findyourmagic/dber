FROM docker.io/node:lts-alpine3.15

RUN mkdir -p /opt/dber
COPY . /opt/dber
WORKDIR /opt/dber
RUN chmod +x start.sh
RUN npm install
RUN npm run build

ENTRYPOINT ["/bin/sh","/opt/dber/start.sh"]
