FROM bitnami/git:2 as GIT
ARG tagName=main

WORKDIR /app

RUN git clone --depth 1 --single-branch -b $tagName https://github.com/angular/angular source

FROM node:16 as NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/

RUN cd /app/source/ && \
    yarn install --frozen-lockfile --non-interactive && \
    yarn bazel build //aio:build --config=release --verbose_failures

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=NODE /app/source/dist/bin/aio/build /www/