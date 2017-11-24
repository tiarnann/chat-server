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

        // Retrieving Client
        const joinId = this.clientsController.getClientJoinId(clientName)
        let client = this.clientsController.getClient(joinId)

        // Creating client if it does not exist
        if(joinId == null){
            client = this.clientsController.addClient(clientName, socket)
        }

        // Creating chatroom
        const chat = this.chatsController.addChat(chatroomName)
        
        if(chat == null){
            return null
        }
        
        // Adding client to Chatroom
        chat.clients[joinId] = client

        // Replying to client
        const joinMessage = new Messages.JoinedChatroomMessage(chatroomName, chat.reference, client.joinId, '0', 0).toString()
        socket.write(joinMessage)
    }

    handleLeave(request: Requests.ChatRequest): boolean {
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
        delete chat.clients[joinId]

        // Replying to client
        const leaveMessage = new Messages.LeftChatroomMessage(roomRef, joinId).toString()

        // Broadcast event to all clients within chat
        Object.keys(chat.clients).forEach(key => {
            const client = chat.clients[key]
            client.connection.write(leaveMessage)
        })

        return true
    }

    handleDisconnect(request: Requests.ChatRequest): boolean{
        const disconnectRequest = request.data as Requests.DisconnectChatroomRequest
        const {clientName} = disconnectRequest

        // Retrieving Client
        const joinId = this.clientsController.getClientJoinId(clientName)
        let client = this.clientsController.getClient(joinId)

        // Creating client if it does not exist
        if(joinId == null){
            // send back error
        }

        // Disconnect user
        request.connection.end()

        const chats = this.chatsController.chats


        Object.keys(chats).forEach(chatKey => {
            const chat = chats[chatKey]

            const leaveMessage = new Messages.LeftChatroomMessage(chat['roomRef'], joinId).toString()
            
            // Broadcast event to all clients within chat
            Object.keys(chat.clients).forEach(key => {
                const client = chat.clients[key]
                client.connection.write(leaveMessage)
            })
        })
        

        return true
    }
    
    handleMessage(request: Requests.ChatRequest): boolean{
        const messageRequest = request.data as Requests.MessageChatroomRequest
        const {clientName, joinId, message, roomRef} = messageRequest
        return true
    }
}