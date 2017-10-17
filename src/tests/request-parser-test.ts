import * as assert from 'assert'
import {CSRequestParser, CSRequestType} from '../services/request-parser'

const parser = new CSRequestParser()

describe('Request',()=>{

    it('should return null for a given request with no text', ()=>{
        const message = new Buffer(`HELO\n`)
        const obj = parser.parse(message)

        assert(obj == null)
    })

    it('should return correct object for a given request with valid text', ()=>{
        const expectedString = "test"
        const message = new Buffer(`HELO ${expectedString}\n`)
        const obj = parser.parse(message)

        assert(obj != null)
        assert(obj.type === CSRequestType.Echo)
        assert(obj.data.message === expectedString)
    })

    it('should return a kill object for a given request with KILL_SERVICE text', ()=>{
        const message = new Buffer(`KILL_SERVICE\n`)
        const obj = parser.parse(message)

        assert(obj != null)
        assert(obj.type === CSRequestType.Kill)
    })
})