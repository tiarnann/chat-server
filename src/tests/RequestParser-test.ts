import * as assert from 'assert'
import * as Services from '../services/RequestParser'
import * as Models from '../models/request' 

describe('Request',()=>{
    const parser = new Services.RequestParser()

    it('should return null for a given request with no text', ()=>{
        const message = new Buffer(`HELO\n`)
        const obj = parser.parse(message)

        assert(obj == null)
    })

    it('should return correct object for a given request with valid text', ()=>{
        const expectedString = "test"
        const message = new Buffer(`HELO ${expectedString}\n\n`)
        const obj = parser.parse(message)

        assert(obj != null)
        assert(obj.type === Models.ChatRequestType.Echo)
        assert(obj.data.message === expectedString)
    })

    it('should return a kill object for a given request with KILL_SERVICE text', ()=>{
        const message = new Buffer(`KILL_SERVICE\n\n`)
        const obj = parser.parse(message)

        assert(obj != null)
        assert(obj.type === Models.ChatRequestType.Kill)
    })

    it('transform keys using the internal keymap',()=>{
        let data = {
            'JOIN_CHATROOM' : 'chatroomName',
            'LEAVE_CHATROOM' : 'roomRef',
            'DISCONNECT':'ip',
            'CLIENT_IP':'ip',
            'CHAT':'roomRef',
            'PORT':'port',
            'JOIN_ID':'joinId',
            'CLIENT_NAME':'clientName',
        }

        let request = new Models.ChatRequest(Models.ChatRequestType.Echo, data, '', 0)
        request = parser.transformDataKeys(request)

        assert(data['JOIN_CHATROOM'] === request.data['chatroomName'])
        assert(data['LEAVE_CHATROOM'] === request.data['roomRef'])
        assert(data['DISCONNECT'] === request.data['ip'])
        assert(data['CHAT'] === request.data['roomRef'])
        assert(data['MESSAGE'] === request.data['message'])
        assert(data['PORT'] === request.data['port'])
        assert(data['JOIN_ID'] === request.data['joinId'])
        assert(data['CLIENT_IP'] === request.data['ip'])
        assert(data['CLIENT_NAME'] === request.data['clientName'])
    })

    it('transforming keys doesn\' create undefined values',()=>{
        let data = {
            'JOIN_CHATROOM' : 'chatroomName',
            'LEAVE_CHATROOM' : 'roomRef',
            'DISCONNECT':'ip',
            'CLIENT_IP':'ip',
            'CHAT':'roomRef',
            'PORT':'port',
            'JOIN_ID':'joinId',
            'CLIENT_NAME':'clientName',
        }

        let request = new Models.ChatRequest(Models.ChatRequestType.Echo, data, '', 0)
        request = parser.transformDataKeys(request)

        Object.keys(request.data).forEach(key => {
            assert(request.data[key] !== undefined, 'undefined value found')
        })
    })
})