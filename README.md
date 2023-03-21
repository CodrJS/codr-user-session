# Codr Session Service

[![CodeQL](https://github.com/CodrJS/codr-user-session/actions/workflows/codeql.yml/badge.svg)](https://github.com/CodrJS/codr-user-session/actions/workflows/codeql.yml)
[![Docker Image CI](https://github.com/CodrJS/codr-user-session/actions/workflows/docker-image.yml/badge.svg)](https://github.com/CodrJS/codr-user-session/actions/workflows/docker-image.yml)

## Purpose

This microservice provides CRUD operations for the Session entity.

## Getting Started

To use this image, pull this image from the [Github Container Registry](https://github.com/CodrJS/codr-user-session/pkgs/container/codr-user-session).

```bash
docker pull ghcr.io/codrjs/codr-user-session:latest
```

In Production, a version tag is preferred.

```bash
docker pull ghcr.io/codrjs/codr-user-session:1.0.0
```

### Producers

- [x] `codr.user.event.session` - used for audit and notification purposes.

### Consumers

- [ ] None

## Contributing

```bash
# Clone the repo
git clone git@github.com:CodrJS/codr-user-session.git

# Install yarn if you don't have it already
npm install -g yarn

# Install dependencies and build the code
yarn install
yarn build

# Building the docker image
yarn build:docker
```

## Environment

Necessary variables needed to run:

| Env var                | Location               | Required | Description                                                                             |
| ---------------------- | ---------------------- | -------- | --------------------------------------------------------------------------------------- |
| `ENV`                  | `env`                  | `true`   | Deployment envionment - `dev`, `qa`, `stage`, `prod`                                    |
| `EXPRESS_HOST`         | `express.host`         | `false`  | Express server - listener host                                                          |
| `EXPRESS_PORT`         | `express.port`         | `false`  | Express server - listener port                                                          |
| `MONGO_URI`            | `mongo.uri`            | `true`   | MongoDB - server URL, please include username and password to this string               |
| `KAFKA_BROKERS`        | `kafka.brokers`        | `true`   | Kafka server - comma seperated locations of the kafka brokers                           |
| `KAFKA_CLIENT_ID`      | `kafka.clientId`       | `true`   | Kafka server - name of the kafka cluster                                                |
| `KAFKA_CONSUMER_GROUP` | `kafka.consumer.group` | `true`   | Kafka server - consumer group                                                           |
| `JWT_SECRET`           | `jwt.secret`           | `true`  | JWT - secret, key to decode jwt, must be the same across all services in an environment |
| `JWT_ISSUER`           | `jwt.issuer`           | `true`  | JWT - issuer, default `codrjs.com`                                                      |
