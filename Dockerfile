FROM debian:latest

RUN apt-get update && apt-get install -y tar
ADD https://ntct-mesos-config-public.s3.amazonaws.com/grafana-3.0.0-pre1.linux-x64.tar.gz /
RUN tar -xzf /grafana-3.0.0-pre1.linux-x64.tar.gz

WORKDIR /grafana-3.0.0-pre1
RUN mkdir -p data/plugins/datasource/aion
COPY . data/plugins/datasource/aion/

ENTRYPOINT ["/grafana-3.0.0-pre1/bin/grafana-server"]
