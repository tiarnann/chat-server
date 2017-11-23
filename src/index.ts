import * as colour from "chalk"
import Server from './services/Server'
import * as Requests from './models/request'
import * as Messages from './models/message'
import ChatroomController from './controllers/ChatroomController'

// Globals
const app = new Server()
const chatroomController = new ChatroomController()
const port = parseInt(process.env.port) || 8080

// Main requests
app.join((connection, request)=>{
    let chatroomRequest = request.data as Requests.JoinChatroomRequest
    console.log(colour.green(`Received join request`));

    const message = chatroomController.handleJoin(chatroomRequest)

    if(message == null){
    console.log('error occurred in join')
    }

    connection.write(message.toString())
})
app.leave((connection, request)=>{
    let chatroomRequest = request.data as Requests.LeaveChatroomRequest
    console.log(colour.green(`Received leave request.`));
})
app.message((connection, request)=>{
    let chatroomRequest = request.data as Requests.MessageChatroomRequest
    console.log(colour.green(`Recevied message.`));
})

// Extra features
app.echo((connection, request)=>{
    let message = request.data.message
    let echoMessage = new Messages.EchoMessage(message,'',0)
    connection.write(echoMessage.toString())
    console.log(colour.green(`Recevied echo event`))
})

app.kill((connection, request)=>{
    console.log(colour.green(`Recevied kill service request. Closing socket`))
    app.close()
    process.exit(0)
})

app.listen(port, ()=>{
    console.log(colour.green(`====\nServer started. Listening on ${port}\n====\n`));
})

