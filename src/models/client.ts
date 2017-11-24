import * as net from 'net'

export class Client {
    constructor(public name: string, public address: string, public port: number, public joinId: number, public connection?: net.Socket){}
}