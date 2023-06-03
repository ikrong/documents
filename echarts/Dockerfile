FROM bitnami/git:2 as GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/apache/echarts-website source

RUN rm -rf /app/source/.git

FROM node:16 as NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/

COPY . /app/js/

RUN cd /app/js &&  \
    ls -l && \
    npm ci && \
    node index.js

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=NODE /app/source /www/