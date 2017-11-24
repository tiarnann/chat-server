import {Chatroom} from '../models/chatroom'
import {Client} from '../models/client'

export default class ChatsController {
    private chatsSeed: number

    /* {CHATROOM_NAME:ROOM_REF} */
    private associatedRoomRef: {string:number}

    /* {ROOM_REF:Chatroom} */
    public chats: {number:Chatroom}

    constructor(){
        this.chats = {} as {number:Chatroom}
        this.chatsSeed = 0
        this.associatedRoomRef = {} as {string:number}
    }

    /**
     * Creates chat with associating name.
     * 
     * @param {string} name 
     * @returns {number} RoomReference is returned if the create was successful, otherwise null.
     * @memberof ChatsController
     */
    addChat(name: string): Chatroom {
        const roomRef: number = this.associatedRoomRef[name]

        if(typeof roomRef === 'undefined'){
            const chatroomRef = this.chatsSeed
            this.chatsSeed += 1
            const chat = new Chatroom(name, chatroomRef)
            this.chats[chatroomRef] = chat
            this.associatedRoomRef[name] = chatroomRef

            return chat
        }

        return null
    }

    removeChat(roomRef: number): boolean {
        const chat = this.chats[roomRef] as Chatroom
        
        if(typeof chat === 'undefined'){
            return false
        }

        delete this.associatedRoomRef[chat.name]
        delete this.chats[roomRef]

        return true
    }


    getChat(roomRef: number): Chatroom {
        return this.chats[roomRef] || null
    }

    getRoomReference(chatroomName: string): number {
        return this.associatedRoomRef[chatroomName]
    }
}