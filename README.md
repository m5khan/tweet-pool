# tweet-pool
Pull the tweets from twitter and store them in DB and Elastic Search for indexing and search


# How to Start The Project

- Checkout the project from github

- rename _.env.template_ to _.env._  `$:/ mv .env.template .env`

- add Twitter access keys to the _.env_ file

- run docker compose in the project directory. `$:/ docker-compose up`

- Access application on localhost: `http://localhost:8080`


- **cronjob:** To setup polling frequency set the `CRON_PATTERN` (currently runs every 60th minute i.e. every hour) variable in *.env*.
for every minute use: `CRON_PATTERN=*/1 * * * *`

# Application Details

## Server
*src* folder in the application belongs to the server

At startup, server bootstrap 3 providers:

Application boostrap following providers in synchronous order.
- **Persistance** (MongoDB and Elasticsearch).
- **Poll** or Scheduler 
  - Poll can be scheduled and run the twitter task.
  - Uses twitter service to fetch tweets and save it to MondoDB and Index in elasticsearch.
- **Web** - Http web server to provide endpoints for client and serve the react application.

Dependency injection framework: *Typedi* from [TypeStack](https://github.com/typestack)

Elasticserch takes longer to start so we defined `ES_SLEEP` and `ES_RETRY` for application to retry during bootstrapping and wait for elasticsearch to start before proceeding.

## Client

- *app* folder contains the client code. Static resources are served from *public* folder.
- client js is bundeled and placed into *public* folder.

## Webpack configuration
Webpack uses ts-loader plugin to compile typescript and bundle both client and server.

Two different modules are used for client and server builds.


## Docker

*docker-compose* start four containers:
- tweetpool - Web Application
- Mongodb
- mongo-express - browser based client for mongo
- elasticsearch

*Dockerfile* builds tweetpool application by preparing the container, copying source to container, installing dependencies, bundle the application.

### TODO
- Implement hotmodule loading for webpack for development
- Execute services shutdown when the application closes.

### misc

In this application context
Providers are bootstrapping the required processes to make the services available



- search API: `http://localhost:3000/tweets/search?q=text:react`
- tweet detail API: `http://localhost:3000/tweets/tweet?id=5e66613833adf2f25fb16457`

- To check MongoDB collection using mongo-express: `http://localhost:8082/db/` (for test purpose)

- To query directly to elastic search: `http://localhost:9200/tweets/_search?q=text:react` (for test purpose)