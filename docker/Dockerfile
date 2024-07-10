FROM --platform=linux/amd64 node:20 AS node

COPY . /app

RUN <<EOF
    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node /app/replace.js /app/html/
    NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/html/
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=node /app/html/ /www/
