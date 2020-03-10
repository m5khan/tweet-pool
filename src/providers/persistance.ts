import { Service } from "typedi";
import { Provider } from ".";
import { MongoDBService } from "../Services/MongoDBService";
import { ElasticSearchService } from "../Services/ElasticSearchService";

@Service()
export class PersistanceProvider implements Provider {
    
    constructor(private mongoService: MongoDBService, private elasticSearchService: ElasticSearchService) { }

    public async bootstrap() {
        await this.mongoService.bootstrap();
        await this.elasticSearchService.bootstrap();
        console.log("elastic search started");
    }

    public async shutdown() {
        
    }

}