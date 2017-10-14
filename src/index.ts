import * as net from "net"
import * as colour from "chalk"

const server = net.createServer((connection) => {
    const info = connection.address()

    connection.on('connect',()=>{
        console.log(colour.green(`Connection established with ${info.address}:${info.port}`));
    })

    connection.on('data',(data)=>{
        console.log(colour.yellow(`Recevied data from ${info.address}:${info.port}`));
        console.log(`${data.toString()}`)
    })

    connection.on('end',()=>{
        console.log(colour.red(`Ended connection with ${info.address}:${info.port}`));
    })
})

const port = process.env.port || 8080

server.listen(port, ()=>{
    console.log(colour.green(`====\nServer started. Listening on localhost:${port}\n====\n`));
})