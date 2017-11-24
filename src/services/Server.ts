import * as net from 'net'
import RequestMapper from  './RequestMapper'
import RequestTransformer from  './RequestTransformer'
import {RequestParser} from './RequestParser'

export default class Server extends RequestMapper {
    private parser: RequestParser
    private transformer: RequestTransformer

    constructor(...args){
        super(...args)

        this.parser = new RequestParser()
        this.transformer= new RequestTransformer()

        this.on('connection',this.handle)
    }

    handle(connection: net.Socket){
        connection.on('data', this.parse.bind(this, connection))
    }

    parse(connection: net.Socket, buffer: Buffer){
        let request = this.parser.parse(buffer)
        request.data = this.transformer.transform(request)

        // attach connection
        request.connection = connection
        
        // Start middleware
        this.go(connection, request)
    }


}