#!/bin/sh
set -e

cd /srv

# Wait for MySQL
echo "Waiting for MySQL at ${MYSQL_HOST:-mysql}:${MYSQL_PORT:-3306}..."
i=0
while ! nc -z "${MYSQL_HOST:-mysql}" "${MYSQL_PORT:-3306}"; do
  i=$((i + 1))
  if [ "$i" -gt 60 ]; then
    echo "MySQL not reachable after 60s"
    exit 1
  fi
  sleep 1
done
echo "MySQL is up."

if [ -f config.lua ]; then
  # Point TFS at the compose MySQL service (keep client-facing ip as 127.0.0.1 for local play)
  sed -i "s|^mysqlHost = .*|mysqlHost = \"${MYSQL_HOST:-mysql}\"|" config.lua
  sed -i "s|^mysqlUser = .*|mysqlUser = \"${MYSQL_USER:-ot74}\"|" config.lua
  sed -i "s|^mysqlPass = .*|mysqlPass = \"${MYSQL_PASSWORD:-ot74}\"|" config.lua
  sed -i "s|^mysqlDatabase = .*|mysqlDatabase = \"${MYSQL_DATABASE:-ot74}\"|" config.lua
  sed -i "s|^mysqlPort = .*|mysqlPort = ${MYSQL_PORT:-3306}|" config.lua
  if [ -n "${SERVER_IP:-}" ]; then
    sed -i "s|^ip = .*|ip = \"${SERVER_IP}\"|" config.lua
  fi
fi

# Least privilege: create user if needed and run tfs as non-root
if ! id tfs >/dev/null 2>&1; then
  useradd -ms /bin/bash tfs
fi

# Ensure the logs directory is writable by tfs
if [ -d "/srv/data/logs" ]; then
  chown tfs:tfs /srv/data/logs || true
fi

# Execute CMD as tfs user
exec gosu tfs "$@"
