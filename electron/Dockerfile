FROM bitnami/git:2 as GIT
ARG CROWDIN_PERSONAL_TOKEN

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/electron/website source

FROM node:20 as NODE
ARG CROWDIN_PERSONAL_TOKEN

WORKDIR /app

COPY --from=GIT /app/source /app/source/
COPY . /app/

RUN /app/tools/install.sh

RUN NODE_PATH=$(npm root --quiet -g) node modify.js

RUN export CROWDIN_PERSONAL_TOKEN="${CROWDIN_PERSONAL_TOKEN}" && \
    cd /app/source/ && \
    yarn && \
    npx tsx scripts/prepare-i18n-content.ts && \
    yarn i18n:glossary && \
    yarn i18n:build

RUN NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/build

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=NODE /app/source/build /www/