import { response } from "express";
import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper"

/*
 @param io from socket.io lib
*/
let chatVideo = (io) =>{
  let clients = {};

  io.on("connection", (socket) =>{
    let currentUserId = socket.request.user._id
    clients = pushSocketIdToArray(clients, currentUserId, socket.id)
    socket.request.user.chatGroupIds.forEach(group =>{
      clients = pushSocketIdToArray(clients, group._id, socket.id)
    });

    socket.on("caller-check-listener-online-or-not", (data) =>{
      // console.log(data);
      if(clients[data.listenerId]){
        //Online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        };

        emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-of-listener", response);
      }
      else{
        //Offline
        socket.emit("server-send-listener-is-offline");
      }
    });

    socket.on("listener-emit-peer-id-to-server", (data) =>{
      // console.log(data);
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId
      }

      // console.log(response);
      if(clients[data.callerId]){
        emitNotifyToArray(clients, data.callerId, io, "server-send-peer-id-of-listener-to-caller", response);   
      }
 
    });
   
    socket.on("caller-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      // console.log(response);

      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-request-call-to-listener",
          response
        );
      }
    });

    socket.on("calller-cancel-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-cancel-request-call-to-listener",
          response
        );
      }
    });

    socket.on("listener-reject-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients, 
          data.callerId, 
          io,
          "server-send-reject-call-to-caller",
          response
        );
      }
    });

    socket.on("listener-accept-request-call-to-server", data => {
      let response = {
        callerId : data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerName: data.listenerName,
        listenerPeerId: data.listenerPeerId,
      };
      if (clients[data.callerId]) {
        emitNotifyToArray(
          clients, 
          data.callerId, 
          io,
          "server-send-accept-call-to-caller",
          response
        );
      }

       if (clients[data.listenerId]) {
        emitNotifyToArray(
          clients, 
          data.listenerId, 
          io,
          "server-send-accept-call-to-listener",
          response
        );
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

module.exports = chatVideo;