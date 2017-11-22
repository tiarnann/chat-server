import * as assert from 'assert'
import ChatsController from '../controllers/ChatsController'
import {Client} from '../models/client'

describe.only('ChatsController',()=>{
    let controller: ChatsController;
    
    before(()=>{
        controller = new ChatsController()
    })

    it('create: should make a new chat if none exist',()=>{
        const chatroomName = 'test room'
        const roomRef = controller.createChat(chatroomName)
        
        assert.notEqual(roomRef, null)
    })

    it('create: should not make a new chat if one exists with the same name',()=>{
        const chatroomName = 'test room'
        controller.createChat(chatroomName)

        const roomRef = controller.createChat(chatroomName)
        
        assert.equal(roomRef, null)
    })

    it('add: should add Client to chat if the chat exists',()=>{
        const chatroomName = 'test room'
        controller.createChat(chatroomName)

        const newClient = new Client('USER', '127.0.0.1', 8080)
        const addedClient = controller.add(newClient, chatroomName)

        assert.equal(addedClient, true)
    })

    it('add: should not add Client to chat if the chat does not exist',()=>{
        const newClient = new Client('USER', '127.0.0.1', 8080)
        const addedClient = controller.add(newClient, 'a room that does not exist')

        assert.equal(addedClient, false)
    })
})