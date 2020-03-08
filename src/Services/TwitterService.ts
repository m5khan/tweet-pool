import { Service } from "typedi";
import Twitter from "twitter";

@Service()
export class TwitterService {

    private twitterClient: Twitter;
    constructor() {
        const accessTokenOptions: Twitter.AccessTokenOptions = {
            consumer_key : process.env.CONSUMER_KEY as string,
            consumer_secret : process.env.CONSUMER_KEY_SECRET as string,
            access_token_key : process.env.ACCESS_TOKEN as string,
            access_token_secret : process.env.ACCESS_TOKEN_SECRET as string
        }
        this.twitterClient = new Twitter(accessTokenOptions);
    }

    getJavascriptTweets() {
        //this.twitterClient.get()
    }

}