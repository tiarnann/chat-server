import * as ChatRequest from '../models/request'

export class ChatRequestParser {
    private echoRegex = /HELO\s(.+)\n\n/
    private killRegex = /KILL_SERVICE\n\n/
    private keyMap = {
        'JOIN_CHATROOM':'chatroomName',
        'LEAVE_CHATROOM':'roomRef',
        'DISCONNECT':'ip',
        'CHAT':'message',
        'PORT':'port',
        'JOIN_ID':'joinId',
        'CLIENT_NAME':'clientName',
        'CLIENT_IP':'ip'
    }

    constructor(){}

    parse(buffer: Buffer): ChatRequest.ChatRequest {
        const data = buffer.toString()

        // Checking for echo or kill
        const killRequest = (this.killRegex).exec(data)
        if(killRequest){
            return new ChatRequest.ChatRequest(ChatRequest.ChatRequestType.Kill, null, null, null)
        }

        const echoRequest = (this.echoRegex).exec(data)
        if(echoRequest){
            const reply = echoRequest[1] || ""
            return new ChatRequest.ChatRequest(ChatRequest.ChatRequestType.Echo, {"message": reply}, null, null)
        }

        // Parse as generic
        return this.genericParse(data)
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