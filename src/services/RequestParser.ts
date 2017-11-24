import * as ChatRequest from '../models/request'

export class RequestParser {
    private echoRegex = /HELO\s(.+)/
    private killRegex = /KILL_SERVICE/
    private keyMap = {
        'JOIN_CHATROOM':'chatroomName',
        'LEAVE_CHATROOM':'roomRef',
        'DISCONNECT':'ip',
        'CHAT':'roomRef',
        'PORT':'port',
        'JOIN_ID':'joinId',
        'CLIENT_NAME':'clientName',
        'CLIENT_IP':'ip',
        'MESSAGE':'message'
    }

    constructor(){}

    parse(buffer: Buffer);
    parse(buffer: string);
    parse(buffer: any): ChatRequest.ChatRequest {
        let data: string = buffer;

        if(buffer instanceof Buffer){
            data = buffer.toString()
            console.log(data)
        }

        // Checking for echo or kill
        const killRequest = (this.killRegex).exec(data)
        if(killRequest){
            return new ChatRequest.ChatRequest(ChatRequest.ChatRequestType.Kill, null, null, null)
        }

        const echoRequest = (this.echoRegex).exec(data)
        console.log(echoRequest)
        if(echoRequest){
            const reply = echoRequest[1] || ""
            return new ChatRequest.ChatRequest(ChatRequest.ChatRequestType.Echo, {"message": reply}, null, null)
        }

        // Parse as generic
        let parsed = this.genericParse(data)
        if(parsed != null){
            const {ip, port} = parsed.data
            parsed.ip = ip
            parsed.port = port
        }

        return parsed
    }

    genericParse(data: string): ChatRequest.ChatRequest{
        // Transforming "Key: Value\nKey: Value\n\n" into {key: value, key: value}
        const restructuredData = data.split('\n').reduce((request, line)=> {
            if(line.length == 0){
                return request
            }

            const {'0': key, '1': value} = line.split(': ')
            request[key] = value

            return request
        }, {} as ChatRequest.ChatRequestData)

        const type = this.getTypeFrom(restructuredData)
        
        if(type){
            const request = new ChatRequest.ChatRequest(type, restructuredData, null, null)
            return this.transformDataKeys(request)
        }

        return null
    }

    getTypeFrom(data: ChatRequest.ChatRequestData): ChatRequest.ChatRequestType {
        if(data['JOIN_CHATROOM']){
            return ChatRequest.ChatRequestType.Join
        } else if(data['LEAVE_CHATROOM']){
            return ChatRequest.ChatRequestType.Leave
        } else if(data['DISCONNECT']){
            return ChatRequest.ChatRequestType.Disconnect
        } else if(data['CHAT']){
            return ChatRequest.ChatRequestType.Message
        }

        return null
    }

    transformDataKeys(request: ChatRequest.ChatRequest): ChatRequest.ChatRequest{
        const transformedData = Object.keys(request.data).reduce((transformed, key)=>{
            const transformedKey = this.keyMap[key]
            const value = request.data[key]

            transformed[transformedKey] = value

            return transformed
        },{})

        request.data = transformedData

        return request
    }
}