FROM node as build
WORKDIR /app
COPY . /app
RUN yarn
EXPOSE 4200
ENTRYPOINT ["yarn","start"]