FROM bitnami/git:2 as GIT

WORKDIR /app

RUN git clone --depth 1 --single-branch -b gh-pages https://github.com/sass/sass-site source
RUN cd /app/source && rm -rf .git

FROM ikrong/mini-http:latest

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"

COPY --from=GIT /app/source/ /www/