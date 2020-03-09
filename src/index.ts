import "reflect-metadata";
import { Provider } from "./providers";
import { Service, Container } from "typedi";
import { WebProvider } from "./providers/web";
import { PollProvider } from "./providers/poller";
import { PersistanceProvider } from "./providers/persistance";
import * as dotenv from "dotenv";
dotenv.config();        // lode variables from .env file to process.environment

@Service()
class Application implements Provider {

    private readonly services: Provider[] = [];

    constructor(
        private persistanceProvider: PersistanceProvider,
        private webProvider: WebProvider,
        private pollProvider: PollProvider,
        ) {
            this.services = [
                persistanceProvider,
                pollProvider,
                webProvider
            ];
        }

    public async bootstrap() {
        for (const service of this.services) {
            console.log(`initializing ${service.constructor.name}...`);
            await service.bootstrap();
        }
    }

    public async shutdown() {
        for (const service of this.services) {
            await service.shutdown();
        }
    }
}

(async () => {
    const server = Container.get<Provider>(Application);
    console.log("Bootstrapping Application...");
    server.bootstrap();
})();