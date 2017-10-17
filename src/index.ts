// Imports
import * as net from "net"
import * as colour from "chalk"
import App from './app'

// Globals
const app = new App()
const port = parseInt(process.env.port) || 8080

// Main requests
app.on('join',(connection, data)=>{
    console.log(colour.green(`Received join request`));
})
app.on('leave',(connection, data)=>{
    console.log(colour.green(`Received leave request.`));
})
app.on('message',(connection, data)=>{
    console.log(colour.green(`Recevied message.`));
})

// Extra features
app.on('echo',(connection, data)=>{
    console.log(colour.green(`Recevied echo event`))
})

app.on('kill',(connection, data)=>{
    console.log(colour.green(`Recevied kill service request. Closing socket`))
    app.close()
    process.exit(0)
})

app.listen(port, ()=>{
    console.log(colour.green(`====\nServer started. Listening on localhost:${port}\n====\n`));
})