#!/bin/sh
set -e

# Simple healthcheck for MySQL used by docker-compose
HOST=${MYSQL_HOST:-mysql}
PORT=${MYSQL_PORT:-3306}

if nc -z "$HOST" "$PORT"; then
  echo "MySQL reachable at $HOST:$PORT"
  exit 0
else
  echo "MySQL not reachable at $HOST:$PORT"
  exit 1
fi
