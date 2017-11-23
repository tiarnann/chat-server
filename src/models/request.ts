export type ChatRequestData = {[path:string]:any} 

export class ChatRequest {
    constructor(public type: ChatRequestType, public data: ChatRequestData, public ip: string, public port:number){
        if(data == null){
            this.data = {}
        }
    }
}

export enum ChatRequestType {
    Join = 'join',
    Leave = 'leave',
    Message = 'message',
    Echo = 'echo',
    Kill = 'kill',
    Disconnect = 'disconnect'
}

/*
    Joining
*/
export class JoinChatroomRequest {
    constructor(public chatroomName: string, public clientName: string){}
}
/*
    Leaving
*/
export class LeaveChatroomRequest {
    constructor(public clientName: string, public roomRef: number, public joinId: number){}
}
/*
    Messaging
*/
export class MessageChatroomRequest {
    constructor(public roomRef: number, public clientName: string, public joinId: number, public message: string){}
}
/*
    Disconnecting
*/
export class DisconnectChatroomRequest {
    constructor(public clientName: string){}
}

