import "reflect-metadata";
import { Provider } from "./providers";
import { Service, Container } from "typedi";
import { WebProvider } from "./providers/web";


@Service()
class Application implements Provider {

    private readonly services: Provider[] = [];

    constructor(
        private webProvider: WebProvider
        ) {
            this.services = [
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