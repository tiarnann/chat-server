import * as assert from 'assert'
import * as Requesting from '../models/request'
import RequestTransformer from '../services/RequestTransformer'
import {ChatRequestParser} from '../services/RequestParser'

describe('RequestTransforming',()=>{
    const transformer = new RequestTransformer()
    const parser = new ChatRequestParser()

    it('should transform chat request with type join to JoinChatroomRequest',()=>{
        const rawJoin = `JOIN_CHATROOM: 0\nCLIENT_IP: 1\nPORT: 123\nCLIENT_NAME: username\n\n`
        
        const request = parser.parse(new Buffer(rawJoin))
        const transformedRequest = transformer.transform(request)
        assert(transformedRequest instanceof Requesting.JoinChatroomRequest)

        const joinRequest = transformedRequest as Requesting.JoinChatroomRequest
        assert.equal(joinRequest.chatroomName, '0','chatroomName should be same from raw data')
        assert.equal(joinRequest.clientName, 'username', 'clientName should be same from raw data')
    })

    it('should transform chat request with type leave to LeaveChatroomRequest',()=>{
        let rawLeave = `LEAVE_CHATROOM: 0\nJOIN_ID: 123\nCLIENT_NAME: username\n\n`
        
        const request = parser.parse(new Buffer(rawLeave))
        const transformedRequest = transformer.transform(request)

        assert(transformedRequest instanceof Requesting.LeaveChatroomRequest)

        const leaveRequest = transformedRequest as Requesting.LeaveChatroomRequest
        assert.equal(leaveRequest.clientName, 'username','clientName should be same from raw data')
        assert.equal(leaveRequest.joinId, 123,'joinId should be same from raw data')
    })

    it('should transform chat request with type disconnect to DisconnectChatroomRequest',()=>{
        let rawDisconnect = `DISCONNECT: 0\nPORT: 0\nCLIENT_NAME: username\n\n`
        
        const request = parser.parse(new Buffer(rawDisconnect))
        const transformedRequest = transformer.transform(request)

        assert(transformedRequest instanceof Requesting.DisconnectChatroomRequest)

        const leaveRequest = transformedRequest as Requesting.DisconnectChatroomRequest
        assert.equal(leaveRequest.clientName, 'username','clientName should be same from raw data')
    })

    it('should transform chat request with type message to MessageChatroomRequest',()=>{
        let rawChat = `CHAT: 0\nJOIN_ID: 9876\nCLIENT_NAME: username\nMESSAGE: bkjsabd askdnasjkdb asdkjnaskjdb\n\n`
        
        const request = parser.parse(new Buffer(rawChat))
        const transformedRequest = transformer.transform(request)

        assert(transformedRequest instanceof Requesting.MessageChatroomRequest)

        const leaveRequest = transformedRequest as Requesting.MessageChatroomRequest
        assert.equal(leaveRequest.clientName, 'username','clientName should be same from raw data')
        assert.equal(leaveRequest.joinId, 9876,'joinId should be same from raw data')
        assert.equal(leaveRequest.message, 'bkjsabd askdnasjkdb asdkjnaskjdb','message should be same from raw data')
        assert.equal(leaveRequest.roomRef, 0,'roomRef should be same from raw data')
    })
})