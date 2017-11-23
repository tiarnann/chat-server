import * as assert from 'assert'
import ChatsController from '../controllers/ChatsController'
import {Client} from '../models/client'

describe('ChatsController',()=>{
    let controller: ChatsController;
    
    beforeEach(()=>{
        controller = new ChatsController()
    })

    it('add: should make a new chat if none exist',()=>{
        const chatroomName = 'test room'
        const roomRef = controller.addChat(chatroomName)
        
        assert.notEqual(roomRef, null)
    })

    it('add: should not make a new chat if one exists with the same name',()=>{
        const chatroomName = 'test room'
        controller.addChat(chatroomName)

        const roomRef = controller.addChat(chatroomName)
        
        assert.equal(roomRef, null)
    })

    it('remove: should delete a chat if it exists and return true',()=>{
        const chatroomName = 'test room'
        const chat = controller.addChat(chatroomName)

        controller.removeChat(chat.reference)
        
        const roomRefOfRemovedChat = controller.getRoomReference(chatroomName)
        assert.equal(roomRefOfRemovedChat, null)
    })

    it('remove: should do nothing if the chat does not exist and return false',()=>{
        const chatRemoveResult = controller.removeChat(0)
        assert.equal(chatRemoveResult, false)
    })
})