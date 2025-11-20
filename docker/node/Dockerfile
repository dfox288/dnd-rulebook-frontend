FROM node:22-alpine as stage-build
ARG MODE=production

WORKDIR /app

RUN apk add py3-setuptools python3 make g++

RUN export NITRO_PRESET=node-cluster
RUN export NITRO_CLUSTER_WORKERS=10
RUN export NUXT_REDIS_HOST=${NUXT_REDIS_HOST}
RUN export NUXT_REDIS_PORT=${NUXT_REDIS_PORT}
RUN export NUXT_REDIS_PASSWORD=${NUXT_REDIS_PASSWORD}

EXPOSE 3000
ENTRYPOINT /usr/local/bin/docker-entrypoint.sh
