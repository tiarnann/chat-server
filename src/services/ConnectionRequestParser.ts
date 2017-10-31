import * as Middleware from "./Middleware";

export default class ConnectionRequestParser extends Middleware.Middleware {
    constructor(){
        super()
    }
    
    request(type: string, ...middleware: Array<Middleware.MiddlewareHandler>){
        middleware.forEach((fn)=>{
            this.use(function(connection, data, next){
                if(data.type === type){
                    fn.call(null, connection, data, next)
                } else {
                    next()
                }
            })
        })
    }

    echo(...middleware: Array<Middleware.MiddlewareHandler>){
        this.request('echo', ...middleware)
    }
    kill(...middleware: Array<Middleware.MiddlewareHandler>){
        this.request('kill', ...middleware)
    }
    join(...middleware: Array<Middleware.MiddlewareHandler>){
        this.request('join', ...middleware)
    }
    leave(...middleware: Array<Middleware.MiddlewareHandler>){
        this.request('leave', ...middleware)
    }
    message(...middleware: Array<Middleware.MiddlewareHandler>){
        this.request('message', ...middleware)
    }
}