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
            this.getCollection().then((cc: ICollection) => {
                c = cc.client;
                return cc.collection;
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
                this.closeConnection(c);
                pReject(err);
            }).finally(() => {
                this.closeConnection(c);
                pResolve();
            });
        });   
    }

    private async getCollection (): Promise<ICollection> {
        const client: MongoClient = await this.openConnection();
        const db: Db = client.db(this.dbName);
        const collection:Collection<any> = await new Promise((resolve, reject) => {
            db.collection(this.collectionName, (err, collection: Collection<any>) => {
                if(err) {
                    client.close();
                    reject(err);
                }
                resolve(collection);
            })
        });
        return {
            client,
            collection
        } as ICollection
    }

    public async countDocuments (): Promise<number> {
        const cc:ICollection = await this.getCollection();
        const docs:number = await cc.collection.countDocuments();
        this.closeConnection(cc.client);
        return docs; 
    }

    public async getTweets () {
        const cc:ICollection = await this.getCollection();
        const docs = await cc.collection.find({},{projection: {_id: 1, created_at: 1, text: 1}}).toArray();
    }
}


interface ICollection {
    collection: Collection<any>;
    client: MongoClient;
}