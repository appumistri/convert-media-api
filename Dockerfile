FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install ffmpeg redis-server -y

CMD redis-server && npm start