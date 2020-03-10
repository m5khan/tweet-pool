# run this file from project root
# docker build -f ./Dockerfile .

# BUILD
# docker build -t tweet-pool:latest -f Dockerfile .

# RUN
# docker run -p 8080:8080 --name tweetpool tweet-pool:latest

FROM node:12-alpine

EXPOSE 8080

WORKDIR /opt/tweet-pool

# COPY package.json /opt/snipper/package.json
COPY . .

RUN npm install && \
    npm run webpack

#CMD ["npm", "run", "start"]           # uncommend this line to run docker file. Run docker compose otherwise.