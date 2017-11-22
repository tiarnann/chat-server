import {Chatroom} from '../models/chatroom'
import {Client} from '../models/client'

export default class ChatsController {
    private chatsSeed: number
    private joinSeed: number

    /* {CHATROOM_NAME:ROOM_REF} */
    private associatedRoomRef: {string:string}

    /* {ROOM_REF:Chatroom} */
    public chats: {string:Chatroom}

    /* {JOIN_ID:Client} */
    private clients: {string:Client}

    constructor(){
        this.clients = {} as {string:Client}
        this.chats = {} as {string:Chatroom}
        this.chatsSeed = 0
        this.joinSeed = 0
        this.associatedRoomRef = {} as {string:string}
    }

    /**
     * Creates chat with associating name.
     * 
     * @param {string} name 
     * @returns {number} RoomReference is returned if the create was successful, otherwise null.
     * @memberof ChatsController
     */
    createChat(name: string): number {
        const roomRef = this.associatedRoomRef[name]

        if(typeof roomRef === 'undefined'){
            const chatroomRef = this.chatsSeed
            this.chatsSeed += 1
            this.chats[chatroomRef] = new Chatroom(name, chatroomRef)
            this.associatedRoomRef[name] = chatroomRef

            return chatroomRef
        }

        return null
    }

    /**
     * Adds client to an existing chat.
     * 
     * @param {Client} client 
     * @param {string} chatroomName 
     * @returns {boolean} True if the add was successful, otherwise false.
     * @memberof ChatsController
     */
    add(client: Client, chatroomName: string): boolean {
        const roomRef = this.associatedRoomRef[chatroomName]
        let chat = (this.chats[roomRef]) as Chatroom

        const chatExists = !!chat
        
        if(!chatExists){
            return false
        }

        chat.clients[client.name] = client

        return true
    }
}