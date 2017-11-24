import {Client} from './client'

export class Chatroom {
    public clients: {number:Client}

    constructor(public name: string, public reference: number){
        this.clients = {} as {number:Client}
    }
}

