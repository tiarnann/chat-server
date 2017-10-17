class Middleware{
    constructor(){}

    go(...args) {
        args.pop()()
    }
    
    use(fn) {
        const go = this.go 
        
        this.go = function(...args){
            const fn_next = args.pop() || function(){}
            args.push(fn_next)
            const next = fn.bind(null, args)
            args.push(next)
            go.bind(this, args).call()
        }
    }
}

