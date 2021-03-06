import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper"

/*
 @param io from socket.io lib
*/
let addNewContact = (io) =>{
  let clients = {};

  io.on("connection", (socket) =>{
    let currentUserId = socket.request.user._id

    clients = pushSocketIdToArray(clients, currentUserId, socket.id)

    socket.on("add-new-contact", (data) =>{
      let currentUser = {
        id:  socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address) ? (socket.request.user.address) : ""
      }

      // console.log(currentUser)
      // Emit notification
      if(clients[data.contactId]){
        emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser)
      }
      
    });

    socket.on("disconnect", ()=>{
      //remove socketId when socket disconect : F5, exit browser
      clients = removeSocketIdFromArray(clients, currentUserId, socket)
    })
  })
  // console.log(clients)
}

module.exports = addNewContact;