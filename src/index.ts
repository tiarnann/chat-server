import * as colour from "chalk"
import Server from './services/Server'
import * as Requests from './models/request'
import * as Messages from './models/message'
import ChatroomController from './controllers/ChatroomController'

// Globals
const app = new Server()
const chatroomController = new ChatroomController()

const connections = []
const port = parseInt(process.env.port) || 8080
let ip: string;



app.use((connection, request, next)=>{
  console.log('\n')
  if(typeof ip == 'undefined'){
    ip = connection.localAddress
  }
  
  // Assign local address and port
  request.ip = ip
  request.port = port
  
  // Collect connection to close in event of 'Kill' event
  connections.push(connection)
  next()
})

// Main requests
app.join((connection, request)=> {
    console.log(colour.yellow(`Received join request.`));
    const result = chatroomController.handleJoin(request)
    
    if(result){
        console.log(colour.green(`Handled join request succesfully.`));
    } else {
      console.log(colour.red('Handling of join request was unsuccessful.'))
    }
})

app.leave((connection, request)=>{
    console.log(colour.yellow(`Received leave request.`))
    const result = chatroomController.handleLeave(request)
    
    if(result){
      console.log(colour.green(`Handled leave request successfully.`));
    } else{
        console.log(colour.red('Error occurred handling leave request.'))
    }
})

app.message((connection, request)=>{
    console.log(colour.yellow(`Recevied user message.`));
    const result = chatroomController.handleMessage(request)

    if(result){
      console.log(colour.green(`Handled user message successfully.`));
    } else {
      console.log(colour.red(`Error occurred handling user message.`));
    }
})

app.disconnect((connection, request)=>{
    console.log(colour.yellow(`Recevied disconnect request.`));
    const result = chatroomController.handleDisconnect(request)

    if(result){
      console.log(colour.green(`Handled user disconnect successfully.`));
    } else {
      console.log(colour.red(`('Error occurred user disconnect request.`));
    }
})

// Extra features
app.echo((connection, request)=>{
    console.log(colour.yellow(`Recevied echo request.`))
    
    let message = request.data.message

    let echoMessage = new Messages.EchoMessage(message, request.ip, request.port)
    connection.write(echoMessage.toString())
  
    console.log(colour.green('Handled  echo request successfully.'))
})

app.kill((connection, request)=>{
    console.log(colour.yellow(`Recevied kill service request.`))
    console.log(colour.blue(`Attempting to close server.`))
    
    connection.destroy()
    connections.forEach(con => con.destroy())
    setTimeout(process.exit.bind(null, 0), 500)
    
})

app.listen(port, ()=>{
    console.log(colour.green(`====\nServer started. Listening on ${port}\n====\n`));
})


// Checking for possible process exceptions
process.on('uncaughtException', function (err) {
  const exception = colour.red(`\nuncaughtException \n${err}\nContinuing process...`)
  console.log(exception)
});
