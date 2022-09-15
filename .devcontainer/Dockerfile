FROM node:16.17.0-bullseye-slim

#
# Install packages.
#
RUN apt update && \
    apt install -y \
        locales \
        git vim curl && \
    apt clean && rm -rf /var/lib/apt/lists/*

#
# Locale = ja-jp.
#
RUN locale-gen ja_JP.UTF-8 && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8

USER node

EXPOSE 3000
