FROM --platform=linux/amd64 bitnami/git:2 AS git

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/tailwindlabs/tailwindcss.com source

RUN rm -rf /app/source/.git

FROM --platform=linux/amd64 node:20 AS node

COPY . /app
COPY --from=git /app/source /app/source/
COPY ./next.config.mjs /app/source/

RUN <<EOF
    cd /app/source
    npm i
    npm run build
    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/out
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=node /app/source/out /www/
COPY ./404.html /404.html