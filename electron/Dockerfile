FROM bitnami/git:2 as GIT
ARG CROWDIN_PERSONAL_TOKEN

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/electron/website source

FROM node:16 as NODE
ARG CROWDIN_PERSONAL_TOKEN

WORKDIR /app

COPY --from=GIT /app/source /app/source/
COPY . /app/

RUN npm i

RUN node index.js

RUN export CROWDIN_PERSONAL_TOKEN="${CROWDIN_PERSONAL_TOKEN}" && \
    cd /app/source/ && \
    yarn && \
    yarn ts-node scripts/prepare-i18n-content.ts && \
    yarn i18n:glossary && \
    yarn i18n:build

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=NODE /app/source/build /www/