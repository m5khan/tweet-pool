import axois from "axios";


export class ApiService {

    private searchUri:string = "http://localhost:3000/tweets/search?q=text:"        // todo : change wrt docker. handler production and development

    public async searchTweet (text:string): Promise<any> {
        return axois.get(this.searchUri + text);
    }

}