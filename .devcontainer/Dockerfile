FROM node:16.14.2-bullseye-slim

#
# Install packages.
#
# - 1. Locale = ja-jp.
#     - locales
# - 2. Utilities.
#     - vim
#     - curl
#
RUN apt update && \
    apt install -y \
        locales \
        git vim curl && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

#
# Locale = ja-jp.
#
# 1. localeがない（locale -a）ためja_JP.UTF-8を生成する
# 2. LANG
# # 3. LANGUAGE
# # 4. デフォルトロケール（2.、3. を実施していない場合エラー）
# # 5. LC_ALL（4. を実施していない場合エラー）
RUN locale-gen ja_JP.UTF-8 && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
# ENV LANGUAGE ja_JP:ja
# RUN update-locale LANG=ja_JP.UTF-8
# ENV LC_ALL ja_JP.UTF-8

USER node

EXPOSE 3000
