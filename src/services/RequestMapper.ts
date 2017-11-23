import * as MiddlewareServer from "./MiddlewareServer";

export default class RequestMapper extends MiddlewareServer.MiddlewareServer {
    constructor(){
        super()
    }
    
    request(type: string, ...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        middleware.forEach((fn)=>{
            this.use(function(connection, data, next){
                console.log(data)
                if(data.type === type){
                    fn.call(null, connection, data, next)
                } else {
                    next()
                }
            })
        })
    }

    echo(...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        this.request('echo', ...middleware)
    }
    kill(...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        this.request('kill', ...middleware)
    }
    join(...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        this.request('join', ...middleware)
    }
    leave(...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        this.request('leave', ...middleware)
    }
    message(...middleware: Array<MiddlewareServer.MiddlewareHandler>){
        this.request('message', ...middleware)
    }
}