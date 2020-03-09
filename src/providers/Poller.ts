import { Service } from "typedi"
import { Provider } from ".";
import { TwitterService } from "../Services/TwitterService";
import Twitter = require("twitter");
import cron from "node-cron";

/**
 * Poll tweets every hour and persist them
 */
@Service()
export class PollProvider implements Provider {

    private task?: cron.ScheduledTask;

    constructor(private twitterService: TwitterService){ }

    public async bootstrap(): Promise<void> {

        //await this.twitterService.executeTask(); // todo: remove this line

        const existingDocs = await this.twitterService.countTweetsInDB();
        if( existingDocs < 100 ) {
            // execute task at start of the process if there are no records already
            console.log("executing twitter task on startup...");
            this.twitterService.executeTask();
        }
        this.task = cron.schedule('*/60 * * * *', () => {       // run job every 60 mins
            console.log("running cron job");
            this.twitterService.executeTask();
        })
    }

    public async shutdown(): Promise<void> {
        if (!!this.task) {
            this.task.stop();
            this.task.destroy();
        }
    }

}