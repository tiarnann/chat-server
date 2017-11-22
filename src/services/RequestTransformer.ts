import * as Parsing from './RequestParser'
import * as Requesting from '../models/request'
import * as Middleware from './Middleware'

export default class RequestTransformer extends Middleware.Middleware {
    constructor(){
        super()
    }

    transform(request: Requesting.ChatRequest): {clientName: string} {
        const {data, type, ip, port} = request
        const {clientName, chatroomName, roomRef, joinId, message, text} = data

        switch(type){
            case Requesting.ChatRequestType.Join:
                return new Requesting.JoinChatroomRequest(chatroomName, clientName)
            case Requesting.ChatRequestType.Leave:
                return new Requesting.LeaveChatroomRequest(clientName, roomRef, joinId)
            case Requesting.ChatRequestType.Disconnect:
                return new Requesting.DisconnectChatroomRequest(clientName)
            case Requesting.ChatRequestType.Message:
                return new Requesting.MessageChatroomRequest(roomRef, clientName, joinId, message)
        }
        
        return null
    }
}