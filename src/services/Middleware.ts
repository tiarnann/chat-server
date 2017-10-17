export default class Middleware{
    constructor(){}

    go(...args) {
        args[args.length - 1]()
    }
    
    use(fn) {
        const go = this.go 
        
        this.go = function(...args){
            const fn_next = args[args.length - 1] || function(){}
            const next = fn.bind(null, ...args, fn_next)
            
            args.pop()
            go.bind(null, ...args, next).call()
        }
    }
}