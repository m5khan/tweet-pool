import { Service } from "typedi"
import { Provider } from ".";

@Service()
export class PollProvider implements Provider {
    constructor(){ }

    public async bootstrap(): Promise<void> {
        
    }

    public async shutdown(): Promise<void> {

    }

}