FROM ubuntu

RUN apt update
RUN apt -y install nodejs
RUN apt -y install npm

ADD . .

RUN npm i

CMD node index.js