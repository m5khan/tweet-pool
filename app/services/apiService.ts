import axois from "axios";

const base:string = "localhost:3000";
//const base:string = "web:3000" 

export class ApiService {

    

    private searchUri:string = `http://${base}/tweets/search?q=text:`        // todo : change wrt docker. handler production and development
    private tweetDetailUri: string = `http://${base}/tweets/tweet?id=` 

    public async searchTweet (text:string): Promise<any> {
        return axois.get(this.searchUri + text);
    }

    public async getTweetDetail (id:string): Promise<any> {
        return axois.get(this.tweetDetailUri + id);
    }

}