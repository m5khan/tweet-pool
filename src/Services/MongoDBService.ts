import { Service } from "typedi";
import { Provider } from "../providers";
import { DataPersistance } from ".";
import { MongoClient, Collection, InsertWriteOpResult, Db } from "mongodb";
import assert from "assert";

@Service()
export class MongoDBService implements Provider, DataPersistance {
    
    private dbUrl: string;
    private dbName: string;
    private collectionName: string = "tweets";
    
    constructor () {
        this.dbUrl = process.env.MONGO_URI as string;
        this.dbName = process.env.DBNAME as string;
    }
    
    /**
    * Check connection to DB
    */
    async bootstrap () {
        const mongoClient :MongoClient = await this.openConnection();
        console.log("MongoDB Server connection successful");
        const db:Db = mongoClient.db(this.dbName);
        db.collection(this.collectionName, (err, collection) => {
            if(err) {
                throw err;
            }
            console.log("collection", collection);
            if(!collection) {
                db.createCollection(this.collectionName, (err, result) => {
                    if(err) {
                        throw err;
                    }
                    mongoClient.close();
                });
            } else {
                mongoClient.close();
            }
        })
        // mongoClient.close();    
    }
    
    /**
    * Close DB connection
    */
    async shutdown () {
        
    }
    
    async openConnection(): Promise<MongoClient> {
        return await MongoClient.connect(this.dbUrl, { useUnifiedTopology: true });
    }
    
    async closeConnection (client: MongoClient) {
        client.close();
    }

    
    public addTweets(tweets:any[]): Promise<void> {
        return new Promise ((pResolve, pReject) => {
            let c: MongoClient;
            this.openConnection()
            .then((client: MongoClient): Promise<Collection<any>> => {
                c = client;
                const db = client.db(this.dbName);
                return new Promise((resolve, reject) => {
                    db.collection(this.collectionName, (err: Error, collection: Collection<any>) => {
                        try{
                            assert.strictEqual(err, null);
                        } catch(err) {
                            reject(err);
                        }
                        resolve(collection);
                    });
                });
            }).then((collection: Collection<any>): Promise<InsertWriteOpResult<any>> => {
                return new Promise((resolve, reject) => {
                    collection.insertMany(tweets, (err: Error, result: InsertWriteOpResult<any>) => {
                        if(err) {
                            reject(err);
                        }
                        resolve(result)
                    });
                });
            }).then((result: InsertWriteOpResult<any>) => {
                assert.strictEqual(result.result.n, tweets.length);
            }).catch((err: Error) => {
                pReject(err);
            }).finally(() => {
                c.close();
                pResolve()
            });
        });   
    }


    public async countDocuments (): Promise<number> {
        const client: MongoClient = await this.openConnection();
        const db: Db = client.db(this.dbName);
        const collection:Collection<any> = await new Promise((resolve, reject) => {
            db.collection(this.collectionName, (err, collection: Collection<any>) => {
                if(err) {
                    reject(err);
                }
                resolve(collection);
            })
        });
        const docs:number = await collection.countDocuments();
        return docs; 
    }
}