import { Provider } from ".";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Service, Container } from "typedi";
import { Server } from "http";
import { tweetRouter } from "../Routes/tweets.router"

@Service()
export class WebProvider implements Provider {

    private appServer?:Server; 

    constructor() {
        if(!process.env.PORT) {
            console.log("Port not found");
            process.exit(1);
        }
    }

    public get port() {
        return parseInt(process.env.PORT as string, 10);
    }

    public async bootstrap() {
        /** App Configuration */
        const server = express();
        server.use(helmet());
        server.use(cors());
        server.use(express.json());
        server.use(express.static("public"));
        /** Adding routers */
        server.use("/tweets", tweetRouter);

        /** Server Activation */
        return new Promise<void> ((resolve, reject) => {
            this.appServer = server.listen(this.port, ((error: Error) => {
                reject(error);
            }));
            console.log("web server listening at port " + this.port);
            resolve();
        });
    }

    public async shutdown() {
        return new Promise<void>((resolve, reject) => {
            this.appServer?.close();
        });
    }
}