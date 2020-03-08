import { Service } from "typedi";
import { Provider } from "../providers";
import { DataPersistance } from ".";

export class MongoDBService implements Provider, DataPersistance {
    
    /**
     * Check connection to DB
     */
    async bootstrap () {

    }

    /**
     * Close DB connection
     */
    async shutdown () {

    }

    async checkConnection () {

    }

    async closeConnection () {}
}