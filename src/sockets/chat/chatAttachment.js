import { response } from "express";
import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper"

/*
 @param io from socket.io lib
*/
let addNewContact = (io) =>{
  let clients = {};

  io.on("connection", (socket) =>{
    let currentUserId = socket.request.user._id
    clients = pushSocketIdToArray(clients, currentUserId, socket.id)
    socket.request.user.chatGroupIds.forEach(group =>{
      clients = pushSocketIdToArray(clients, group._id, socket.id)
    });

    socket.on("chat-attachment", (data) =>{
      // console.log(data);
     if(data.groupId){
      let response = {
        currentGroupId: data.groupId,
        currentUserId: socket.request.user._id,
        message: data.message 
      };
      if(clients[data.groupId]){
        emitNotifyToArray(clients, data.groupId, io, "response-chat-attachment", response);
      } 
     }

     if(data.contactId){
       let response = {
         currentUserId: socket.request.user._id,
         message: data.message 
       };

      //  console.log(response.message);
       if(clients[data.contactId]){
         emitNotifyToArray(clients, data.contactId, io, "response-chat-attachment", response);
       }
     }
 
    });
   
    socket.on("disconnect", ()=>{
      //remove socketId when socket disconect : F5, exit browser
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group =>{
        clients = removeSocketIdFromArray(clients, group._id, socket.id)
      });
    })
  })
  // console.log(clients)
}

module.exports = addNewContact;