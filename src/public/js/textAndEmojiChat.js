function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element){
    console.log(element)
    if(element.which === 13){
      let targetId =  $(`#write-chat-${divId}`).data("chat");
      let messageVl =  $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVl.length){
        return false;
      }

      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVl
      }

      if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
        dataTextEmojiForSend.isChatGroup = true;
      }

      //call send message 
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){

      }).fail(function(response){

      })
    }
  })

}