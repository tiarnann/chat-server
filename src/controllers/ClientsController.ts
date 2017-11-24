import {Client} from '../models/client'
import * as net from 'net'

export default class ClientsController {
    private nameToJoinIdMap: {string:number}
    private joinIdToClientMap: {number:Client}
    private joinSeed: number

    constructor(){
        this.nameToJoinIdMap = {} as {string:number}
        this.joinIdToClientMap = {} as {number:Client}
        this.joinSeed = 0
    }

    addClient(name: string, connection: net.Socket): Client {
        const joinId = this.nameToJoinIdMap[name]
        
        if(typeof joinId == 'undefined'){
            const newJoinId = this.getNewJoinId()
            
            const newClient = new Client(name, '0', 0, newJoinId, connection)
            
            // Map relationships
            this.nameToJoinIdMap[name] = newJoinId
            this.joinIdToClientMap[newJoinId] = newClient

            return newClient
        }

        return null
    }

    removeClient(joinId: number): boolean{
        const client = this.joinIdToClientMap[joinId] as Client
        
        if(typeof client == 'undefined'){
            return false
        }
        
        delete this.nameToJoinIdMap[client.name]
        delete this.joinIdToClientMap[joinId]
        return true
    }

    getClient(joinId: number): Client {
        const client = this.joinIdToClientMap[joinId]

        if(typeof client == 'undefined'){
            return null
        }

        return client
    }

    getClientJoinId(name: string): number {
        const joinId = this.nameToJoinIdMap[name]

        if(typeof joinId === 'undefined'){
            return null
        }

        return joinId
    }

    clientExistsWithName(name: string): boolean {
        return (this.getClientJoinId(name) != null)
    }

    getNewJoinId(): number {
        const newJoinId = this.joinSeed
        this.joinSeed += 1
        return newJoinId
    }
}