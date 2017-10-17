import * as net from 'net'
import {CSRequestParser, CSRequestType} from './services/RequestParser'

export default class App extends net.Server {
    private parser: CSRequestParser

    constructor(){
        super()
        this.parser = new CSRequestParser()
        this.on('connection',this.handle)
    }

    handle(connection: net.Socket){
        connection.on('data', this.request.bind(this, connection))
    }

    request(connection: net.Socket, buffer: Buffer){
        const {type, data} = this.parser.parse(buffer)
        
        if(type && data){
            this.emit(type, connection, data)
        }
    }
}