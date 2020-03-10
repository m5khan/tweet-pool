# tweet-pool
Pull the tweets from twitter and store them in DB and Elastic Search for indexing and search



In this application context
Providers are bootstrapping the required processes to make the services available



- search API: `http://localhost:3000/tweets/search?q=text:react`
- tweet detail API: `http://localhost:3000/tweets/tweet?id=5e66613833adf2f25fb16457`

todo: change `/tweets/tweet?id=id` to `/tweets/id`



# Deployment instructions

- Checkout the project from github
- rename _.env.template_ with _.env._  `$:/ mv .env.template .env`
- add Twitter access keys to the _.env_ file
- run docker compose in the project directory. `$:/ docker-compose up`
- Application runs at: `http://localhost:8080`
- To check MongoDB collection using mongo-express: `http://localhost:8082/db/`
- To query directly to elastic search: `http://localhost:9200/tweets/_search?q=text:react`

## Application Details

### Server
Server bootstrap 3 processes:
- Persistance (MongoDB, Elasticsearch)
- Poll or Scheduler 
  - use twitter service to fetch tweets and save it to MondoDB and Index in elasticsearch
- Web - Http web server to provide endpoints for client and serve the react application

### Webpack configuration
Webpack uses ts-loader plugin to compile typescript and bundle on both client and server.

Two different modules are used for client and server builds.