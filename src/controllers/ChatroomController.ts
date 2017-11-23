/* Controllers */
import ClientsController from './ClientsController'
import ChatsController from './ChatsController'
import * as Messages from '../models/message'

/* Models */
import * as Requests from '../models/request'

export default class ChatroomController {
    private chatsController: ChatsController
    private clientsController: ClientsController

    constructor(){
        this.chatsController = new ChatsController() 
        this.clientsController = new ClientsController() 
    }

    handleJoin(request: Requests.JoinChatroomRequest): boolean {
        const {clientName, chatroomName} = request
        const joinId = this.clientsController.getClientJoinId(clientName)
        
        let client = this.clientsController.getClient(joinId)

        if(joinId == null){
            client = this.clientsController.addClient(clientName)
        }

        const chat = this.chatsController.addChat(chatroomName)

        chat.clients[joinId] = client
        
        return true
    }

    handleLeave(request: Requests.LeaveChatroomRequest): boolean{
        const {clientName, joinId, roomRef} = request
        
        const clientExists = this.clientsController.clientExistsWithName(clientName)

        if(!clientExists){
            return false
        }

        const chat = this.chatsController.getChat(roomRef)

        if(!!chat){
            return false
        }

        delete chat.clients[joinId]
        
        return true
    }

    handleDisconnect(request: Requests.DisconnectChatroomRequest){}
    handleMessage(request: Requests.MessageChatroomRequest){}
}