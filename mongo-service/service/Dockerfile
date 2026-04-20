# Stage 1: Build the application
FROM gradle:8.13-jdk21 AS build

WORKDIR /opt/palmyra
COPY . .

RUN gradle clean build installDist

FROM openjdk:21-jdk-slim
ARG DIST_DIR=/opt/palmyra/dist
RUN mkdir -p /opt/palmyra/logs
COPY --from=build ${DIST_DIR} /opt/palmyra
WORKDIR /opt/palmyra

ENV JAVA_OPTS="--add-opens=java.base/java.time=ALL-UNNAMED --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.util=ALL-UNNAMED"

ENTRYPOINT ["sh", "./bin/dms-main"]