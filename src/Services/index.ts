export interface DataPersistance {
    openConnection(): Promise<any>;
    closeConnection: (connection:any) => Promise<any>;
}

export interface TweetDBSearch {
    _id: any;
    text: string;
    created_at: string;
}

export interface SearchTweetData {
    id: string,
    text: string,
    created_at: Date;
}

export interface IndexMapProperties extends SearchTweetData {
    id: any
    text: any,
    created_at: any
}