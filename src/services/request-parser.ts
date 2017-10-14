interface CSRequest {
    type: CSRequestType
}

enum CSRequestType {
    Join = 'join',
    Leave = 'leave',
    Message = 'message',
    Echo = 'echo',
    Kill = 'kill'
}

class CSRequestParser {
    constructor(){}
    
    match(data: String){}

    parse(buffer: Buffer): CSRequest {
        return {"type": CSRequestType.Echo}
    }
}