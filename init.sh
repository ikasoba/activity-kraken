#!/bin/sh

RUN() {
  $*
  __exit_code=$?
  if [ $__exit_code != 0 ]; then
    echo "failed execute: $*"
    echo "exit code: $__exit_code"
    exit 1
  fi
}

read -p "proxy port: " proxy_port
read -p "instance URL: " ap_host

if [ ! -d ".git" ]; then
  RUN git clone https://github.com/ikasoba/activity-kraken/
fi

if [ -f ".env" ]; then
  cp .env .env-previous
fi

cp .env-example .env

if [ ! -z "$proxy_port" ]; then
  echo "PORT=$proxy_port" >> .env
fi

if [ ! -z "$ap_host" ]; then
  echo "PROXY_HOST=$ap_host" >> .env
fi