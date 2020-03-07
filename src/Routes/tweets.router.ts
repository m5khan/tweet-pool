import express from "express";


export const tweetRouter = express.Router();

tweetRouter.get("/", (req: express.Request, res: express.Response) => {
    res.json("Well now, I get low and I get high \
    And if I can't get either, I really try \
    Got the wings of heaven on my shoes \
    I'm a dancin' man and I just can't lose")
});

tweetRouter.get("/search", (req: express.Request, res: express.Response) => {
    res.json("searched tweet");
})
