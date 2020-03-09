import { Service } from "typedi";
import Twitter from "twitter";
import { MongoDBService } from "../Services/MongoDBService";
import { TweetDBSearch, SearchTweetData } from ".";
import { ElasticSearchService } from "./ElasticSearchService";

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

    constructor(private dbService: MongoDBService, private searchService: ElasticSearchService) {
        const accessTokenOptions: Twitter.AccessTokenOptions = {
            consumer_key : process.env.CONSUMER_KEY as string,
            consumer_secret : process.env.CONSUMER_KEY_SECRET as string,
            access_token_key : process.env.ACCESS_TOKEN as string,
            access_token_secret : process.env.ACCESS_TOKEN_SECRET as string
        }
        this.twitterClient = new Twitter(accessTokenOptions);
        
    }

    private getJavascriptTweets(): Promise<any[]> {
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

    private async saveTweetsToDB(tweets: any[]) {
        await this.dbService.addTweets(tweets);
    }

    public async countTweetsInDB() {
        const tweetCount: number = await this.dbService.countDocuments();
        return tweetCount;
    }

    public async getTweetsFromDB(id:any):Promise<TweetDBSearch[]> {
        return this.dbService.getTweets(id);
    }

    public async mapDbTweetToSearchIndex(tweets: TweetDBSearch[]): Promise<SearchTweetData[]> {
        const bulkToIndex: SearchTweetData[] = tweets.map((e: TweetDBSearch) => {
            return {
                id: e._id.toString(),
                created_at: new Date(e.created_at),
                text: e.text
            } as SearchTweetData 
        });
        return bulkToIndex;
    }

    /**
    * Twitter service fetches the tweet from twitter
    * persist tweets into the database
    * index tweets into the search server
     */
    public async executeTask() {
        let lastId:any = null;
        const tweets: any[] = await this.getJavascriptTweets();
        const lastTweetInDB = await this.dbService.getLastRecord();
        if (lastTweetInDB.length) {
            lastId = lastTweetInDB[0]._id;
        }
        await this.saveTweetsToDB(tweets);
        const dbTweets: TweetDBSearch[] = await this.getTweetsFromDB(lastId);
        const bulkToIndex: SearchTweetData[] = await this.mapDbTweetToSearchIndex(dbTweets);
        await this.searchService.bulkIndexTweets(bulkToIndex);
    }


    public async searchTweet(searchStr: string) {
        return this.searchService.searchInTweetIndex(searchStr);
    }

    public async getTweetDetail(strId: string) {
        return this.dbService.getTweetFromId(strId);
    }

}