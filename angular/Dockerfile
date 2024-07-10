FROM --platform=linux/amd64 bitnami/git:2 AS git
ARG tagName=main

WORKDIR /app

RUN git clone --depth 1 --single-branch -b $tagName https://github.com/angular/angular source

FROM --platform=linux/amd64 node:20 AS node

WORKDIR /app

COPY . /app
COPY --from=git /app/source /app/source/

RUN <<EOF
    set -e

    apt update
    # chromedriver deps
    apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates libappindicator1 libnss3 lsb-release xdg-utils fonts-liberation fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf

    cd /app/source/

    /app/tools/install.sh
    NODE_PATH=$(npm root --quiet -g) node /app/replace.js /app/source/

    yarn install --frozen-lockfile --non-interactive
    yarn bazel build //adev:build --fast_adev --verbose_failures=true
    cp /app/source/dist/bin/adev/build/browser/index.csr.html /app/source/dist/bin/adev/build/browser/index.html
    chmod -R 777 /app/source/dist/bin/adev/build/browser

    NODE_PATH=$(npm root --quiet -g) node /app/tools/index.js /app/source/dist/bin/adev/build/browser
EOF

FROM ikrong/mini-http:latest
ARG DOCWORLD_SOURCE

LABEL org.opencontainers.image.authors="contact@ikrong.com"
LABEL org.opencontainers.image.source="https://github.com/ikrong/documents"
LABEL org.docworld.source="$DOCWORLD_SOURCE"

COPY --from=node /app/source/dist/bin/adev/build/browser /www/

CMD [ "/serve", "--domain", "0.0.0.0", "--mode", "history" ]