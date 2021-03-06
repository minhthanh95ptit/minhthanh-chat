import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "../../helpers/socketHelper"

/*
 @param io from socket.io lib
*/
let removeContact = (io) =>{
  let clients = {};

  io.on("connection", (socket) =>{
    let currentUserId = socket.request.user._id

    clients = pushSocketIdToArray(clients, currentUserId, socket.id)

    socket.on("remove-contact", (data) =>{
      let currentUser = {
        id: socket.request.user._id
      }

      // Emit notification
      if(clients[data.contactId]){
        emitNotifyToArray(clients, data.contactId, io, "response-remove-contact", currentUser)
      }
      
    });

    socket.on("disconnect", ()=>{
      //remove socketId when socket disconect : F5, exit browser
     clients = removeSocketIdFromArray(clients, socket.request.user._id, socket)
    })
  })
  // console.log(clients)
}

module.exports = removeContact;