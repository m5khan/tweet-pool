import { Service } from "typedi";
import { Provider } from "../providers";
import { DataPersistance, IndexMapProperties, SearchTweetData } from ".";
import {
    Client,
    // Object that contains the type definitions of every API method
    RequestParams,
    // Interface of the generic API response
    ApiResponse,
} from '@elastic/elasticsearch'
import { TransportRequestOptions } from "@elastic/elasticsearch/lib/Transport";

@Service()
export class ElasticSearchService implements Provider, DataPersistance {
    
    private sleepTime:number = parseInt(process.env.ES_SLEEP as string);
    private retry:number = parseInt(process.env.ES_RETRY as string);
    private client:Client = new Client({ node: process.env.ES_URI });
    private tweetIndex = "tweets";

    private sleep = async (ms:number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    public async bootstrap(): Promise<void> {
        for (var i = 0 ; i < this.retry; i++) {
            try{
                await this.client.ping()
                break;
            } catch(err) {
                console.log(`waiting for elasticsearch ${i}`);
                await this.sleep(this.sleepTime);
                if(i == this.retry) {
                    throw err
                }
            }
        }
        return;
    }
    
    public async shutdown() {}
    
    public async openConnection () {}
    
    public async closeConnection () {}
    
    public async indexRecord (record: SearchTweetData) {
        try{
            await this.client.index({
                index: "tweets1",
                body: record
            });
        } catch(err) {
            throw err
        }
        
        
        this.client.indices.refresh({index: "tweets1"});
        
        // search
        const response: ApiResponse<any>|undefined = await this.client.search({
            index: 'tweets1',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                query: {
                    match: { text: 'javascript' }
                }
            }
        });
        
        console.log(response);
    }
    
    /**
    * Bulk index tweets to Elastic Search
    * Source: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/bulk_examples.html
    * 
    * @param data data for indexing
    */
    public async bulkIndexTweets (data: SearchTweetData[]) {
        await this.client.indices.create({
            index: this.tweetIndex,
            body: {
                mappings: {
                    properties: {
                        id: { type: 'text' },
                        text: { type: 'text' },
                        created_at: { type: 'date' }
                    } as IndexMapProperties
                }
            }
        }, {ignore : [400]} as TransportRequestOptions); // statuscode that should not be considered as an error for this request
        
        const body = data.flatMap(doc => [{ index: { _index: this.tweetIndex } }, doc])
        const apiResponse: ApiResponse<any> | undefined = await this.client.bulk({ refresh: 'true', body });
        if(!apiResponse) {
            throw new Error("Elastic search client unavailable");
        }    
        // const count = await this.client.count({ index: this.tweetIndex })
        // console.log(count)
    }
    
    
    public async searchInTweetIndex(str: string) {
        const searchParams: RequestParams.Search<SearchBody> = {
            index: this.tweetIndex,
            body: {
                query: {
                    match: { text: str }
                }
            }
        }
        const response: ApiResponse<SearchResponse<Source>>|undefined = await this.client.search(searchParams)
        if(response) {
            return response.body;
        }else {
            throw new Error("Elasticsearch client not available");
        }
    }
    
}


interface SearchBody {
    query: {
        match: { text: string }
    }
}

// Complete definition of the Search response
interface ShardsResponse {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
}

interface SearchResponse<T> {
    took: number;
    timed_out: boolean;
    _scroll_id?: string;
    _shards: ShardsResponse;
    hits: {
        total: number;
        max_score: number;
        hits: Array<{
            _index: string;
            _type: string;
            _id: string;
            _score: number;
            _source: T;
            _version?: number;
            fields?: any;
            highlight?: any;
            inner_hits?: any;
            matched_queries?: string[];
            sort?: string[];
        }>;
    };
    aggregations?: any;
}

interface Source {
    text: string
}