FROM bitnami/git:2 as GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/go-gorm/gorm.io.git source

RUN rm -rf /app/source/.git

FROM node:18 as NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/

RUN cd /app/source/ && \
    npm i && \
    npm run build

COPY . /app

RUN /app/tools/install.sh

RUN NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/public/

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=NODE /app/source/public/ /www/