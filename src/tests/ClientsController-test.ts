import * as assert from 'assert'
import ClientsController from '../controllers/ClientsController'
import {Client} from '../models/client'

describe('ClientsController',()=>{
    let controller: ClientsController;
    
    beforeEach(()=>{
        controller = new ClientsController()
    })

    it('add: should make a new client if none exist',()=>{
        const clientName = 'username'
        const client = controller.addClient(clientName, null)
        
        assert.notEqual(client, null)
    })

    it('add: should not make a new client if one exists with the same name',()=>{
        const clientName = 'username'
        controller.addClient(clientName, null)

        const client = controller.addClient(clientName, null)
        
        assert.equal(client, null)
    })

    it('remove: should delete a client if it exists and return true',()=>{
        const clientName = 'username'
        const client = controller.addClient(clientName, null)

        controller.removeClient(client.joinId)
        
        const joinIdOfRemovedClient = controller.getClientJoinId(clientName)
        assert.equal(joinIdOfRemovedClient, null)
    })

    it('remove: should do nothing if the client does not exist and return false',()=>{
        const clientRemoveResult = controller.removeClient(0)
        assert.equal(clientRemoveResult, false)
    })

    it('get: should return client when one exists',()=>{
        const clientName = 'username'
        const addedClient = controller.addClient(clientName, null)

        const client = controller.getClient(addedClient.joinId)

        assert.notEqual(client, null)
        assert.deepEqual(client, addedClient)
    })

    it('getNewJoinId: new join ids must be unique',()=>{
        const currentJoinSeed = controller.getNewJoinId()
        const nextJoinSeed = controller.getNewJoinId()

        assert.notEqual(currentJoinSeed,nextJoinSeed)
    })

    it('clientExistsWithName: should check if client exists with name',()=>{
        const clientName = 'username'

        const clientDoesntExists = controller.clientExistsWithName(clientName)
        assert.equal(clientDoesntExists, false,'client should not exist yet')

        const client = controller.addClient(clientName, null)

        const clientExists = controller.clientExistsWithName(clientName)
        assert.equal(clientExists, true, 'client should exist after addition')
    })

    it('getClientJoinId: should return joinId for a given name',()=>{
        const clientName = 'username'
        
        const nonexistentJoinId = controller.getClientJoinId(clientName)
        assert.equal(nonexistentJoinId, null)

        const client = controller.addClient(clientName, null)        
        const retrievedJoinId = controller.getClientJoinId(clientName)

        assert.equal(retrievedJoinId, client.joinId)
    })
})