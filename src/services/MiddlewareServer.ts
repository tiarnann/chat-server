import * as net from "net"
import * as Models from '../models/request'
export type MiddlewareHandler = (connection: net.Socket, data: Models.ChatRequest, next: Function) => void

export class MiddlewareServer extends net.Server {

    go(...args) {
        (args[args.length - 1] || function(){})()
    }
    
    use(fn) {
        const go = this.go 
        const _this = this
        
        this.go = (...args)=> {
            const lastArg = args[args.length - 1]

            // If there is no middleware left
            // pass fn a nop
            let fn_next = function(){}

            if(lastArg instanceof Function){
                fn_next = lastArg

                // Pop the last function from args so go can be passed fn 
                args.pop()
            }

            const next = fn.bind(null, ...args, fn_next)

            go.call(null, ...args, next)
        }
    }
}