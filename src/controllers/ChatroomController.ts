/* Controllers */
import ClientsController from './ClientsController'
import ChatsController from './ChatsController'

/* Models */
import * as Requests from '../models/request'
import * as Messages from '../models/message'

export default class ChatroomController {
    private chatsController: ChatsController
    private clientsController: ClientsController

    constructor(){
        this.chatsController = new ChatsController() 
        this.clientsController = new ClientsController() 
    }

    handleJoin(request: Requests.ChatRequest): boolean {
        // Extracting request content
        const socket = request.connection
        const joinRequest = request.data as Requests.JoinChatroomRequest
        const {clientName, chatroomName} = joinRequest
        const {ip, port} = request

        // Retrieving Client
        const joinId = this.clientsController.getClientJoinId(clientName)
        let client = this.clientsController.getClient(joinId)

        // Creating client if it does not exist
        if(joinId == null){
            console.log('user not found')
            client = this.clientsController.addClient(clientName, socket)
        }

        // Creating chatroom
        const roomRef = this.chatsController.getRoomReference(chatroomName)
        let chat = this.chatsController.getChat(roomRef)
        
        if(chat == null){
            console.log('chat not found')
            chat = this.chatsController.addChat(chatroomName)
        }
        
        // Adding client to Chatroom
        chat.clients[client.joinId] = client

        // Replying to client
        const joinMessage = new Messages.JoinedChatroomMessage(chatroomName, chat.reference, client.joinId, ip, port).toString()
        socket.write(joinMessage)
        
        // Broadcast event to all clients within chat
        const userJoinedMessage = new Messages.MessageChatroomMessage(chat.reference, client.name, `${client.name} has joined this chatroom.`).toString()
      
        Object.keys(chat.clients).forEach(key => {
            const currentClient = chat.clients[key]
            currentClient.connection.write(userJoinedMessage)
        })

        return true
    }

    handleLeave(request: Requests.ChatRequest): boolean {
        const socket = request.connection
        const leaveRequest = request.data as Requests.LeaveChatroomRequest
        const {clientName, joinId, roomRef} = leaveRequest
        
        // Retrieving Client
        let client = this.clientsController.getClient(joinId)

        if(client == null){
            return false
        }

        const chat = this.chatsController.getChat(roomRef)

        if(chat == null){
            return false
        }

        // Remove client
        delete chat.clients[client.joinId]

        // Replying to client
        const leaveMessage = new Messages.LeftChatroomMessage(roomRef, client.joinId).toString()
        socket.write(leaveMessage)
      
        // Broadcast event to all clients within chat
        const userLeftMessage = new Messages.MessageChatroomMessage(chat.reference, clientName, `${clientName} has left this chatroom.`).toString()
        socket.write(userLeftMessage)
      
        Object.keys(chat.clients).forEach(key => {
            const currentClient = chat.clients[key]
            currentClient.connection.write(userLeftMessage)
        })

        return true
    }

    handleDisconnect(request: Requests.ChatRequest): boolean{
        const socket = request.connection
        const disconnectRequest = request.data as Requests.DisconnectChatroomRequest
        const {clientName} = disconnectRequest

        // Retrieving Client
        const joinId = this.clientsController.getClientJoinId(clientName)
        let client = this.clientsController.getClient(joinId)

        // Creating client if it does not exist
        if(joinId == null){
            // send back error
        }

        const chats = this.chatsController.chats


        Object.keys(chats).forEach(chatKey => {
            const chat = chats[chatKey]

            const leaveMessage = new Messages.MessageChatroomMessage(chat.reference, clientName, `${clientName} has left this chatroom.`).toString()

            // Broadcast event to all clients within chat
            const clients = Object.keys(chat.clients)
            if(typeof chat.clients[client.joinId] != 'undefined'){
              clients.forEach(key => {
                const currentClient = chat.clients[key]
                currentClient.connection.write(leaveMessage)
              })
            }
            
            delete chat.clients[client.joinId]
        })
        
        this.clientsController.removeClient(client.joinId)
      
        socket.end()
      
        return true
    }
    
    handleMessage(request: Requests.ChatRequest): boolean{
        const socket = request.connection
        const messageRequest = request.data as Requests.MessageChatroomRequest
        const {clientName, joinId, message, roomRef} = messageRequest
        

        // Retrieving Client
        let client = this.clientsController.getClient(joinId)

        if(client == null){
            return false
        }

        const chat = this.chatsController.getChat(roomRef)

        if(chat == null){
            return false
        }
    
        const userMessage = new Messages.MessageChatroomMessage(chat.reference, clientName, message).toString()

        Object.keys(chat.clients).forEach(key => {
            const currentClient = chat.clients[key]
            currentClient.connection.write(userMessage)
        })
        
        return true
    }
}