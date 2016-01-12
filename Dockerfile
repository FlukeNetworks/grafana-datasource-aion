FROM debian:latest

RUN apt-get update && apt-get install -y tar
ADD https://grafanarel.s3.amazonaws.com/builds/grafana-latest.linux-x64.tar.gz /
RUN tar -xzf /grafana-latest.linux-x64.tar.gz

WORKDIR /grafana-3.0.0-pre1
RUN mkdir -p data/plugins/aion
COPY . data/plugins/aion/

ENTRYPOINT ["/grafana-3.0.0-pre1/bin/grafana-server"]
