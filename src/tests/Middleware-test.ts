import * as assert from 'assert'
import Middleware from '../services/Middleware'

describe('Middleware',()=>{

    it('go should be a nop when nothing is attached', ()=>{
        const m = new Middleware()
        m.go()
    })

    it('last middleware should be given a nop', ()=>{
        const m = new Middleware()

        m.use(function(next){
            assert(!!next)
            assert(next() === undefined)
        })

        m.go()
    })

    it('same objects are passed to all middleware', ()=>{
        const m = new Middleware()

        let obj = {}
        
        m.use(function(obj, next){
            obj.a = "a"
            next()
        })

        m.use(function(obj, next){
            obj.b = "b"
            assert(!!obj.a)
            next()
        })

        m.use(function(obj, next){
            assert(!!obj.a)
            assert(!!obj.b)
            assert(next() === undefined)
        })

        m.go(obj)

    })
})