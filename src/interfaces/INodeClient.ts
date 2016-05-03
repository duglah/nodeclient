export interface INodeClient {
    debug: boolean;
    command: string;
    port: string;
    host: string;
    mainNodePort: string;
    onRecieveHandler: (answer: Answer, data: any) => void;
    defaultTimeout: number;


    init(cb: (error?: any) => void): void;
    start(cb: (error?: any) => void): void;
    createCommand(): { command: string, port: string };
    ping(): void;
    register(callback: (error: any, success: boolean) => void): void;
    onReceive(handler: (answer: Answer, param?: any) => void): void;
}

export class Answer {
    response: any;

    constructor(response: any) {
        this.response = response;
    }

    public send(data?: any): void {
        this.response.json({ "result": data });
    }
}

export default INodeClient;