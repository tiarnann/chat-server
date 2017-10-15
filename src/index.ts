// Imports
import * as net from "net"
import * as colour from "chalk"
import {CSRequestParser, CSRequestType} from "./services/request-parser"
import App from './app'

// Globals
const app = new App()
const port = parseInt(process.env.port) || 8080

// Main requests
app.on('join',(connection, data)=>{})
app.on('leave',(connection, data)=>{})
app.on('message',(connection, data)=>{})

// Extra features
app.on('echo',(connection, data)=>{
    console.log(colour.green(`Recevied echo event`))
})

app.on('kill',(connection, data)=>{})

app.listen(port, ()=>{
    console.log(colour.green(`====\nServer started. Listening on localhost:${port}\n====\n`));

    let sock = new net.Socket()
    sock.connect(port, 'localhost', (con)=>{
        sock.write('HELO test\n')
    })
})
