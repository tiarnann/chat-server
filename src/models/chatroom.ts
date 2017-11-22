import {Client} from './client'

export class Chatroom {
    public clients: {string:Client}

    constructor(public name: string, public reference: number){
        this.clients = {} as {string:Client}
    }
}

