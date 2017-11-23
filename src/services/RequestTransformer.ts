import * as Parsing from './RequestParser'
import * as Requesting from '../models/request'
import * as net from 'net'

export default class RequestTransformer {
    constructor(){}

    transform(request: Requesting.ChatRequest): {clientName: string} {
        if(request.type == Requesting.ChatRequestType.Echo || request.type == Requesting.ChatRequestType.Kill){
            return null
        }
        
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