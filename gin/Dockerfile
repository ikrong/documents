FROM --platform=linux/amd64 bitnami/git:2 AS GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/gin-gonic/website.git source && \
    cd source && \
    git clone --recurse-submodules --depth 1 https://github.com/google/docsy.git themes/docsy

FROM --platform=linux/amd64 floryn90/hugo:0.125.4-ext-ubuntu AS NODE

WORKDIR /app

COPY --from=GIT /app/source /app/source/

COPY . /app

RUN /app/tools/install.sh

RUN NODE_PATH=$(npm root --quiet -g) node /app/modify.js /app/source/ 

RUN cd /app/source/ && \
    hugo

RUN NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/public/

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=NODE /app/source/public/ /www/