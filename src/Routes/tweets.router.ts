import express from "express";
import { Container } from "typedi";
import { TwitterService } from "../Services/TwitterService";


export const tweetRouter = express.Router();

tweetRouter.get("/", (req: express.Request, res: express.Response) => {
    res.json("Well now, I get low and I get high \
    And if I can't get either, I really try \
    Got the wings of heaven on my shoes \
    I'm a dancin' man and I just can't lose")
});

tweetRouter.get("/search", (req: express.Request, res: express.Response) => {
    const query = req.query;
    if(query.q) {
        const queryStr = query.q;
        const qarr = queryStr.split(':');
        qarr.shift();
        const qstr = qarr.join();
        const twitterService: TwitterService = Container.get(TwitterService);
        twitterService.searchTweet(qstr).then((result) => {
            res.json(result)
        });
    } else {
        res.json("invalid query");
    }
})
