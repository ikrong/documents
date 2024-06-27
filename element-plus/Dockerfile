FROM bitnami/git:2 as GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch --branch gh-pages https://github.com/element-plus/element-plus.git

RUN rm -rf /app/element-plus/.git

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=GIT /app/element-plus /www/