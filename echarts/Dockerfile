FROM --platform=linux/amd64 bitnami/git:2 AS GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch --branch asf-site https://github.com/apache/echarts-website source

RUN rm -rf /app/source/.git

FROM --platform=linux/amd64 node:16 AS NODE

WORKDIR /app

COPY . /app/
COPY --from=GIT /app/source /app/source/

RUN <<EOF
    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node  /app/index.js /app/source/
    NODE_PATH=$(npm root --quiet -g) node  /app/tools/index.js /app/source/
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=NODE /app/source /www/