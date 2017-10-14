import * as assert from 'assert'
import {CSRequestParser, CSRequestType} from './request-parser'

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
})