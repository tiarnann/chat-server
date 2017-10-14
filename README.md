# Internet Applications Lab

## TODO
- [x] Start port number
- [ ] Kill switch 
- [ ] Echo server
- [ ] Joining
- [ ] Leaving
- [ ] Messaging

## Introduction

The lab this week involves implementing a centralised chat server, building on your TCP multithreaded socket solution built previously. A protocol is described in detail below, that describes how clients can join chat rooms, post messages and retrieve messages, and leave chat rooms. Your task is to implement a server supporting this protocol, submit the source code repository and submit details of an executing server for testing in the normal manner.

Your server implementation need not be concerned with partial system failure, latecommers or other compliations that a real solution would have to deal with. You need not be concerned with proxy/firewall infrastructure or any similar LAN concerns. Your system must be capable of handling multiple simultaneous clients however. Note that you need only implement UDP or TCP. You do not have to implement a server that responds to both.

## Chat Protocol

The following describes a simple chat room client-server protocol in terms of a set of message/response descriptions. The protocol has been designed presumed on stream connections between clients and server, with stream connections used to provide a callback capability from client to server. However, you may opt to design a UDP based implementation. If you do this however, you will have to implement some degree of error recovery and message fragmentation handling.

### Control

The server should implement the basic message set of the previous labs for identification and shutdown of the server, in addition to the message types detailed below.

### Joining

Joining a chat room is initiated by a client by sending the following message to a chat server.

```
JOIN_CHATROOM: [chatroom name]
CLIENT_IP: [IP Address of client if UDP | 0 if TCP]
PORT: [port number of client if UDP | 0 if TCP]
CLIENT_NAME: [string Handle to identifier client user]
```
If the client is connecting to the server over TCP, then `CLIENT_IP` and `PORT` should be empty fields (but should still be present). If connecting over UDP, then these fields should identify the ip address and port number the server should use to make callbacks to the client. Note that these need not be the same as the port and ip address used to transmit the join request. `CLIENT_NAME` is a nickname or handle for the user.

The Server responds (directly over the stream connection for TCP or via the previously mentioned `CLIENT_IP` and PORT if operating over UDP), with the following message, which must be sent before any chat messages are forwarded to the client. This should be sent to the `CLIENT_IP` on port `PORT` if present (and thus UDP).

```
JOINED_CHATROOM: [chatroom name]
SERVER_IP: [IP address of chat room]
PORT: [port number of chat room]
ROOM_REF: [integer that uniquely identifies chat room on server]
JOIN_ID: [integer that uniquely identifies client joining]
```

The server should then send a message to the chat room indicating that the client has joined the chat room. The message should contain the client handle provided in CLIENT_NAME.

The `SERVER_IP`, `PORT` fields may specify an alternative IP address and/or port number used by the client to connect to the server to initiate a join request. If so, then the client should use the provided details for all further client/server communication. The `ROOM_REF` field should be used by the client to identify the chat room when posting and retrieving messages. Note that a client can post to more than one chat room concurrently. The `JOIN_ID` uniquely (from server perspective) identifies the client that has joined. The client should use this identifier in all subsequent communication with the server.

A failure (in response to this message to join, or any other client/server messaging) should result in an `ERROR_CODE` message being sent to the client instead. If an error occurs, a client should print the error to the console and terminate.

```
ERROR_CODE: [integer]
ERROR_DESCRIPTION: [string describing error]
```

### Leaving

A client leaves a chat room by sending the following message to the chat server:

```
LEAVE_CHATROOM: [ROOM_REF]
JOIN_ID: [integer previously provided by server on join]
CLIENT_NAME: [string Handle to identifier client user]
```

The server responds with the following message:

```
LEFT_CHATROOM: [ROOM_REF]
JOIN_ID: [integer previously provided by server on join]
```

The server should also post a message to the relevant chatroom indicating that the client has disconnected.

The sending of repeat copies of the `LEAVE_CHATROOM` message type should result in the same `LEFT_CHATROOM` message, even if the client is presently not connected to the chat room.

On sending of this `LEFT_CHATROOM` message, the server should send no further `CHAT` messages to the client in respect of the chat room left. Note however, that the server should complete the transmission of any chat message in progress before sending the `LEFT_CHATROOM` message. Thus, the `LEFT_CHATROOM` message might not be the immediate response to a `LEAVE_CHATROOM` request, but should interrupt chat flow at the next available opportunity. Note also, that if a client has joined more than one chat room, the server should continue to send chat messages in respect of other chat rooms that the client remains connected to. Thus, a `LEAVE_CHATROOM` message should not cause the server to terminate the client/server socket connection.

To terminate the client/server connection, a client will send the following message to the server, which should respond by terminating the connection.
```
DISCONNECT: [IP address of client if UDP | 0 if TCP]
PORT: [port number of client it UDP | 0 id TCP]
CLIENT_NAME: [string handle to identify client user]
```

### Messaging

To send a chat message the client sends the following:

```
CHAT: [ROOM_REF]
JOIN_ID: [integer identifying client to server]
CLIENT_NAME: [string identifying client user]
MESSAGE: [string terminated with '\n\n']
```

The server should send the following message to every client presently connected to the chat room:
```
CHAT: [ROOM_REF]
CLIENT_NAME: [string identifying client user]
MESSAGE: [string terminated with '\n\n']
```

You should write this script to launch your service by whatever means are necessary. It should be possible to terminate your service by sending the following message string to your service via the main port number:

		  "KILL_SERVICE\n"
		
Your service should also respond to the message:

		  "HELO text\n"
		
with the string

		  "HELO text\nIP:[ip address]\nPort:[port number]\nStudentID:[your student ID]\n"