FROM node:10.8.0-alpine

# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
# RUN yarn config set registry 'https://registry.npm.taobao.org'

RUN apk update
RUN apk add --no-cache curl php7 openjdk8-jre-base

ENV JAVA_HOME /usr/lib/jvm/default-jvm
ENV PATH ${PATH}:${JAVA_HOME}/bin

WORKDIR /app

COPY . .

RUN yarn --production && yarn cache clean
RUN yarn global add pm2

EXPOSE 8088:8088

CMD ["yarn", "start"]
