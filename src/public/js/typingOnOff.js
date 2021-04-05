function typingOn(divId){
  let targetId = $(`#write-chat-${divId}`).data("chat");

  if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
    socket.emit("user-is-typing", {groupId: targetId})
  }
  else{
    socket.emit("user-is-typing", {contactId: targetId})
  }
}

function typingOff(divId){
  let targetId = $(`#write-chat-${divId}`).data("chat");

  if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
    socket.emit("user-is-not-typing", {groupId: targetId})
  }
  else{
    socket.emit("user-is-not-typing", {contactId: targetId})
  }
}

$(document).ready(function(){
  // Listen typing on
  socket.on("response-user-is-typing", function(response){

    // console.log(response)
    let messageTyping = `<div class="bubble you bubble-typing-gif">
        <img src="/images/chat/typing.gif" />
      </div>`;

      // console.log($("#dropdown-navbar-user").data("uid"));

      if(response.currentGroupId){
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
          // console.log("FUCK YOU")
          let check  = $(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif")
          if(check.length){
            return false
          }
          $(`.chat[data-chat=${response.currentGroupId}]`).append(messageTyping);
          nineScrollRight(response.currentGroupId);
        }
      }
      else{
        // console.log("FUCK YOU")
  
        let check = $(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif")
          if(check.length){
            return false
          }
        $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping);
        nineScrollRight(response.currentUserId);
        // console.log("hello world")
      }
  })
  // Listen typing off
  socket.on("response-user-is-not-typing", function(response){
    if(response.currentGroupId){
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        $(`.chat[data-chat=${response.currentGroupId}]`).find("div.bubble-typing-gif").remove();
        nineScrollRight(response.currentGroupId);
      }
    }
    else{
      $(`.chat[data-chat=${response.currentUserId}]`).find("div.bubble-typing-gif").remove();
      nineScrollRight(response.currentUserId);
    }
  })
})