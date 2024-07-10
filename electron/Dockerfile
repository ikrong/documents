FROM --platform=linux/amd64 bitnami/git:2 AS GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/electron/website source

FROM --platform=linux/amd64 node:20 AS NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/
COPY . /app/

RUN <<EOF
    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node modify.js
    cd /app/source/
    yarn
    npx tsx scripts/prepare-i18n-content.ts
    yarn i18n:build
    NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/build
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=NODE /app/source/build /www/