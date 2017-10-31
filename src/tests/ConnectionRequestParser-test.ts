import * as assert from 'assert'
import * as net from 'net'
import ConnectionRequestParser from "../services/ConnectionRequestParser"
import {MiddlewareHandler} from "../services/Middleware"

describe('ConnectionRequestParser',() => {
    it('should map middleware to requests',() => {
        const parser = new ConnectionRequestParser()
        let functionAWasCalled = false
        let functionBWasCalled = false
        let functionCWasCalled = false
        
        let functionA: MiddlewareHandler = function(connection: net.Socket, data: any, next: Function) {
            functionAWasCalled = true;
            next()
        }

        let functionB: MiddlewareHandler = function(connection: net.Socket, data: any, next: Function) {
            assert(functionAWasCalled);
            functionBWasCalled = true;
            next()
        }

        let functionC: MiddlewareHandler = function(connection: net.Socket, data: any, next: Function) {
            assert(functionBWasCalled);
            functionCWasCalled = true;
            next()
        }

        parser.request('join', functionA, functionB, functionC)
        
        parser.go(new net.Socket(), {type: 'join'})
        
        assert(functionCWasCalled)

    })


    it('mapped middleware that doesn\'t trigger due to data.type should still pass onto the next middleware',() => {
        const parser = new ConnectionRequestParser()
        let functionAWasCalled = false
        let functionBWasCalled = false
        let functionCWasCalled = false
        
        let functionA: MiddlewareHandler = (connection: net.Socket, data: any, next: Function) => {
            functionAWasCalled = true;
            next()
        }

        let functionB: MiddlewareHandler = (connection: net.Socket, data: any, next: Function) => {
            functionBWasCalled = true;
            next()
        }

        let functionC: MiddlewareHandler = (connection: net.Socket, data: any, next: Function) => {
            assert(functionBWasCalled == false);
            functionCWasCalled = true;
            next()
        }

        parser.use(functionA)
        parser.request('join',functionB)
        parser.use(functionC)
        
        parser.go(new net.Socket(), {type: 'not join'})
        assert(functionAWasCalled, "function A should be called")
        assert(functionCWasCalled, "function C should be called")

    })
})