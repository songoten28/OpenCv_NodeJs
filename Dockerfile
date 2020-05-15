FROM node:13.8.0-stretch
ENV APP_PATH=/app
WORKDIR $APP_PATH
COPY ./package.json /app/package.json

COPY ./cmake-3.16.1-Linux-x86_64.sh /app/cmake-3.16.1-Linux-x86_64.sh
RUN sh /app/cmake-3.16.1-Linux-x86_64.sh --skip-license
ENV PATH "$APP_PATH/bin:$PATH"

ENV OPENCV4NODEJS_AUTOBUILD_OPENCV_VERSION 4.1.0

RUN yarn global add node-gyp
RUN yarn add opencv4nodejs
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD 1

RUN yarn
COPY ./src /app/src

CMD ["yarn", "dev"]
#CMD ["nodemon", "-L", "./src/index.js"]
