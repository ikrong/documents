FROM --platform=linux/amd64 bitnami/git:2 AS GIT
ARG repoName=vuejs/docs

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/$repoName source

RUN rm -rf /app/source/.git

FROM --platform=linux/amd64 node:18 AS NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/

COPY . /app

RUN /app/tools/install.sh

RUN NODE_PATH=$(npm root --quiet -g) node /app/replace-3.js /app/source/

RUN cd /app/source/ && \
    npm i -g pnpm && \
    pnpm i && \
    pnpm run build

RUN NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/.vitepress/dist

RUN NODE_PATH=$(npm root --quiet -g) node /app/after-3.js /app/source/.vitepress/dist

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=NODE /app/source/.vitepress/dist /www/