export interface DataPersistance {
    openConnection(): Promise<any>;
    closeConnection: (connection:any) => Promise<any>;
}