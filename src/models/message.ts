/*
    Error
*/
export class ErrorMessage{
    constructor(public code: number, public description: number){}

    toString(){
        return `ERROR_CODE: ${this.code}\nERROR_DESCRIPTION: ${this.description}}\n\n`
    }
}

/*
    Joined
*/
export class JoinedChatroomMessage {
    constructor(public chatroomName: string, public roomReference: number, public joinId: number, public ip: string, public port: number){}

    toString(){
        return `JOINED_CHATROOM: ${this.chatroomName}\nSERVER_IP: 0.0.0.0\nPORT: ${this.port}\nROOM_REF: ${this.roomReference}\nJOIN_ID: ${this.joinId}\n\n`
    }
}

/*
    Leaving
*/
export class LeftChatroomMessage {
    constructor(public roomReference: number, public joinId: number){}

    toString(): string {
        return `LEFT_CHATROOM: ${this.roomReference}\n` + `JOIN_ID: ${this.joinId}\n\n`
    }
}

/*
    Message
*/
export class MessageChatroomMessage {
    constructor(public roomReference: number, public clientName: string, public message: string){}

    toString(){
        return `CHAT: ${this.roomReference}\nCLIENT_NAME: ${this.clientName}\nMESSAGE: ${this.message}\n\n`
    }
}

export class EchoMessage {
    constructor(public message: string, public ip: string, public port: number){}

    toString(){
        return `HELO ${this.message}\nIP: 0.0.0.0\nPort: ${this.port}\nStudentID :${process.env['student-id'] || 0}\n`
    }
}