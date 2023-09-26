FROM bitnami/git:2 as GIT

ARG repoName=react.dev

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/reactjs/$repoName source

RUN rm -rf /app/source/.git

FROM node:16 as NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/
COPY ./next.config.js /app/source/

RUN cd /app/source && \
    yarn && \
    yarn add next@13 && \
    yarn build && \
    ls -l

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=NODE /app/source/out /www/