export interface CSRequest {
    type: CSRequestType;
    data;
}

export enum CSRequestType {
    Join = 'join',
    Leave = 'leave',
    Message = 'message',
    Echo = 'echo',
    Kill = 'kill'
}

export class CSRequestRegexPattern {
    static Join = /JOIN_CHATROOM:\s([A-Za-z]*)\nCLIENT_IP:\s([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|0)\nPORT:\s([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|0)\nCLIENT_NAME:\s([A-Za-z])*\n/g
    static Echo = /HELO\s(.+)\n/
}

export class CSRequestParser {
    constructor(){}
    
    parseEcho(data: string): CSRequest{
        const parsed = CSRequestRegexPattern.Echo.exec(data)

        if (parsed != null){
            const data =  {'message': parsed[1]}
            return {'type': CSRequestType.Echo, 'data': data}
        }
        return null
    }

    parse(buffer: Buffer): CSRequest {
        const data = buffer.toString()
        
        if(CSRequestRegexPattern.Echo.test(data)){
            return this.parseEcho(data)
        }

        return null
    }
}
