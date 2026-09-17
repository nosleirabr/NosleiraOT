# TFS 1.2 (7.4) — multi-stage build (context = this server repo root)
FROM ubuntu:22.04 AS build

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libboost-system-dev \
    libboost-iostreams-dev \
    liblua5.3-dev \
    libmysqlclient-dev \
    libpugixml-dev \
    libgmp-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY CMakeLists.txt ./
COPY cmake ./cmake
COPY src ./src

# cotire breaks on modern CMake — disable it
RUN sed -i 's/include(cotire)/#include(cotire)/' CMakeLists.txt \
 && sed -i '/set_target_properties(tfs PROPERTIES COTIRE/d' CMakeLists.txt \
 && sed -i '/cotire(tfs)/d' CMakeLists.txt

RUN mkdir -p build && cd build \
 && cmake .. -DCMAKE_BUILD_TYPE=Release -DUSE_LUAJIT=OFF -DLUA_INCLUDE_DIR=/usr/include/lua5.3 -DLUA_LIBRARY=/usr/lib/x86_64-linux-gnu/liblua5.3.so \
 && cmake --build . -- -j"$(nproc)"

FROM ubuntu:22.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    libboost-system1.74.0 \
    libboost-iostreams1.74.0 \
    liblua5.3-0 \
    libmysqlclient21 \
    libpugixml1v5 \
    libgmp10 \
    ca-certificates \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /src/build/tfs /usr/local/bin/tfs
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/healthcheck.sh /usr/local/bin/healthcheck.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
 && chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/tfs /usr/local/bin/healthcheck.sh

WORKDIR /srv
EXPOSE 7171 7172
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["tfs"]
