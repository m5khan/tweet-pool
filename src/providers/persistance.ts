import { Service } from "typedi";
import { Provider } from ".";
import { MongoDBService } from "../Services/MongoDBService";

@Service()
export class PersistanceProvider implements Provider {
    
    constructor(private mongoService: MongoDBService) { }

    public async bootstrap() {
        this.mongoService.bootstrap();
    }

    public async shutdown() {
        
    }

}