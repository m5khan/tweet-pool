import { Service } from "typedi"
import { Provider } from ".";
import { TwitterService } from "../Services/TwitterService";
import Twitter = require("twitter");
import cron from "node-cron";

@Service()
export class PollProvider implements Provider {

    private task?: cron.ScheduledTask;

    constructor(private twitterService: TwitterService){ }

    public async bootstrap(): Promise<void> {
        this.task = cron.schedule('*/30 * * * *', () => {       // run job every 60 mins
            console.log("running cron job");
        })
    }

    public async shutdown(): Promise<void> {
        if (!!this.task) {
            this.task.stop();
            this.task.destroy();
        }
    }

}