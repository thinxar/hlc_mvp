FROM openjdk:21-jdk-slim
ARG DIST_DIR=./dist

RUN mkdir -p /opt/palmyra/logs
ADD ${DIST_DIR} /opt/palmyra
WORKDIR /opt/palmyra

ENTRYPOINT ["sh", "./bin/dms-main"]