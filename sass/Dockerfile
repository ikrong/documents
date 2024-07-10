FROM --platform=linux/amd64 bitnami/git:2 AS git

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/sass/sass-site source
RUN cd /app/source && rm -rf .git

FROM --platform=linux/amd64 node:20 AS node

COPY --from=git /app/source /app/source

RUN <<EOF
    cd /app/source
    npm install
    npm run build-prod
EOF

COPY . /app

RUN <<EOF
    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/_site
    NODE_PATH=$(npm root --quiet -g) node /app/after.js /app/source/_site
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=node /app/source/_site /www/
COPY ./404.html /404.html
