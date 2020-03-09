import React, { Component} from "react";
import ListPane from "../components/listPane";
import DetailPane from "../components/detailPane";
import {ApiService} from "../services/apiService";


interface MyProps {
    [key:string]:any;
}

interface MyState {
    [key:string]:any
}

class App extends Component<MyProps, MyState> {
    
    private searchText: string = "";
    private apiService: ApiService;

    constructor (props: React.Props<MyProps>) {
        super(props);
        this.state = {
            tweetList: [],
            tweetDetail: {}
        }
        this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
        this.tweetClickHandler = this.tweetClickHandler.bind(this);
        this.apiService = new ApiService();
    }
    
    render(){
        return(
            <div className="App">
                <h1> Twitter Pool </h1>
                <input type="text" onKeyDown={this.onKeyPressHandler}></input>
                <ListPane tweetList={this.state.tweetList} tweetClickHandler={this.tweetClickHandler}></ListPane>
                <DetailPane tweetDetail={this.state.tweetDetail}></DetailPane>
            </div>
            );
    }

    private onKeyPressHandler (e:React.KeyboardEvent<HTMLElement>) {
        const target:any = e.target;
        if(e.keyCode == 13 && target.value) {
            console.log(target.value);
            this.apiService.searchTweet(target.value).then((results:any) => {
                const records = results.data.hits.hits;
                this.setState(Object.assign(this.state, {tweetList: records}));
            }).catch((err) => {
                console.error(err);
            })
        }
    }

    private tweetClickHandler (id: string) {
        this.apiService.getTweetDetail(id).then((result) => {
            this.setState(Object.assign(this.state, {tweetDetail: result.data}));
        });
    }

}
    
    export default App;