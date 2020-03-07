import "reflect-metadata";
import { Provider } from "./providers";
import { Service, Container, Inject } from "typedi";
import { WebProvider } from "./providers/web";


@Service()
class Application implements Provider {

    constructor(private webProvider: WebProvider) {
        console.log(this.webProvider);
    }

    public async bootstrap() {
        this.webProvider.bootstrap();
    }

    public async shutdown() {

    }
}

(async () => {
    const server = Container.get<Provider>(Application);
    console.log("Bootstrapping Application...");
    server.bootstrap();
})();