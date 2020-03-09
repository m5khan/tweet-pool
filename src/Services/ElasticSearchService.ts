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
import { response } from "express";

@Service()
export class ElasticSearchService implements Provider, DataPersistance {
    
    private client?:Client;
    
    public async bootstrap() {
        this.client = new Client({ node: process.env.ES_URI })
    }
    
    public async shutdown() {}
    
    public async openConnection () {}
    
    public async closeConnection () {}

    public async indexRecord (record: SearchTweetData) {
        try{
            await this.client?.index({
                index: "tweets1",
                body: record
            });
        } catch(err) {
            throw err
        }
        

        this.client?.indices.refresh({index: "tweets1"});

        // search
        const response: ApiResponse<any>|undefined = await this.client?.search({
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
        await this.client?.indices.create({
            index: 'tweets',
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
        
        const body = data.flatMap(doc => [{ index: { _index: 'tweets' } }, doc])
        const apiResponse: ApiResponse<any> | undefined = await this.client?.bulk({ refresh: 'true', body });
        if(!apiResponse) {
            throw new Error("Elastic search client unavailable");
        }    
        // const count = await this.client?.count({ index: 'tweets' })
        // console.log(count)
    }
}