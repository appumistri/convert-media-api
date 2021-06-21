FROM ubuntu:18.04

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y nodejs npm ffmpeg=4.3.2

COPY . .

CMD npm install && npm start