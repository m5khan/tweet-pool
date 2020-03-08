import { Service } from "typedi";
import Twitter from "twitter";

type searchQueryOptions = {[key: string]: string| number};

/**
 * Twitter service fetches the tweet from twitter
 * persist tweets into the database
 * index tweets into the search server
 */
@Service()
export class TwitterService {

    private twitterClient: Twitter;
    private searchMetadata: any;        // todo: persist this for polling purpose

    constructor() {
        const accessTokenOptions: Twitter.AccessTokenOptions = {
            consumer_key : process.env.CONSUMER_KEY as string,
            consumer_secret : process.env.CONSUMER_KEY_SECRET as string,
            access_token_key : process.env.ACCESS_TOKEN as string,
            access_token_secret : process.env.ACCESS_TOKEN_SECRET as string
        }
        this.twitterClient = new Twitter(accessTokenOptions);
        
    }

    private getJavascriptTweets(): Promise<Twitter.ResponseData> {
        return new Promise((resolve, reject) => {
            const searchQueries: searchQueryOptions = {
                q: "#javascript",
                count: 100,
            };
            (this.searchMetadata && this.searchMetadata.since_id ? searchQueries.since_id = this.searchMetadata.since_id : null);
            this.twitterClient.get('search/tweets', searchQueries, (error: Error, tweets: Twitter.ResponseData, response) => {
                if(error) {
                    reject();
                }
                this.searchMetadata = tweets.search_metadata;
                resolve(tweets.statuses);
             });
        });
        
    }

    /**
    * Twitter service fetches the tweet from twitter
    * persist tweets into the database
    * index tweets into the search server
     */
    public executeTask() {
        
    }

}