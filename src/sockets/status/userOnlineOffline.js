import { response } from "express";
import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper"

/*
 @param io from socket.io lib
*/
let userOnlineOffline = (io) =>{
  let clients = {};

  io.on("connection", (socket) =>{
    let currentUserId = socket.request.user._id
    clients = pushSocketIdToArray(clients, currentUserId, socket.id)
    socket.request.user.chatGroupIds.forEach(group =>{
      clients = pushSocketIdToArray(clients, group._id, socket.id)
    });

    let listUserOnline = Object.keys(clients);

    // console.log(listUserOnline);
    //Step 01: Emit to user when user login or f5 web page
    socket.emit("server-send-list-users-online", listUserOnline);

    //Step 02: Emit to all another users when has new user online
    socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
   
    socket.on("disconnect", ()=>{
      //remove socketId when socket disconect : F5, exit browser
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group =>{
        clients = removeSocketIdFromArray(clients, group._id, socket.id)
      });
      //Step 03: Emit to all another users when has new user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
    })
  })
  // console.log(clients)
}

module.exports = userOnlineOffline;