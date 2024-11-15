FROM node as build
WORKDIR /app
COPY . /app
RUN yarn
EXPOSE 3000
ENTRYPOINT ["yarn","start"]