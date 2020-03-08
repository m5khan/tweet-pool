export interface DataPersistance {
    checkConnection: () => Promise<void>;
    closeConnection: () => Promise<void>;
}