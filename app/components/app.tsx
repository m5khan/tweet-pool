import React, { Component} from "react";
import ListPane from "../components/listPane";
import DetailPane from "../components/detailPane";
import {ApiService} from "../services/apiService";

import "../styles/app.css"


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
            tweetDetail: null
        }
        this.onKeyPressHandler = this.onKeyPressHandler.bind(this);
        this.tweetClickHandler = this.tweetClickHandler.bind(this);
        this.apiService = new ApiService();
    }
    
    render(){
        return(
            <div className="App">
                <h1> TWEET POOL </h1>
                <input placeholder="search" type="text" onKeyDown={this.onKeyPressHandler}></input>
                <div style={{marginTop: '10px'}}>
                    <div className="listbox">
                        <ListPane tweetList={this.state.tweetList} tweetClickHandler={this.tweetClickHandler}></ListPane>
                    </div>
                    <div className="detailbox">
                        <DetailPane tweetDetail={this.state.tweetDetail}></DetailPane>
                    </div>
                </div>
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