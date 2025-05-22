FROM --platform=linux/amd64 bitnami/git:2 AS git

WORKDIR /app

RUN git clone --depth 1 --single-branch https://github.com/07akioni/xicons.git source

RUN rm -rf /app/source/.git

FROM --platform=linux/amd64 node:20 AS node

RUN <<EOF
  cd /app/source
  pnpm run setup
  pnpm --filter xicons run 
  pnpm --filter xicons-site i vue
  pnpm --filter xicons run build:for-site
  pnpm --filter xicons-site run build
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=node /app/source/packages/xicons-site/site /www/
