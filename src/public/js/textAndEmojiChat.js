function textAndEmojiChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element){
    let currentEmojioneArea = $(this);
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

      // console.log(dataTextEmojiForSend);
      //call send message 
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){

        //Step 1: Handle message data before show
        let messageOfMe = $(` <div class="bubble me" data-mess-id="${data.message._id}"></div>`);

        if(dataTextEmojiForSend.isChatGroup){
          messageOfMe.escapeHTML(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"`);
          //Thay vi data.message.html ta dung .text vi de tranh nguoi dung chen script len
          messageOfMe.text(data.message.text);
          caculateNumberMessageGroup(divId);
        }else{
          messageOfMe.text(data.message.text);
        }
        //conver sang the image(emoji)
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());
        // console.log(convertEmojiMessage)
        messageOfMe.html(convertEmojiMessage);

        //Step 02: Append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe); 
        nineScrollRight(divId);

        //Step 3: remove all data input
        //Xoa 2 cho: input an va emojione 
       $(`#write-chat-${divId}`).val("");
       currentEmojioneArea.find(".emojionearea-editor").text("");

       //Step 4: change data in left side. preview message
      //  let momentTime = moment(timestamp).locale("vi").startOf("seconds").fromNow();
       $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
      
       $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

       //Step 5: Move conversation on top
       //click.move... de phan biet voi changeScreen
       $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function(){
         let dataToMove = $(this).parent();
         $(this).closest("ul").prepend(dataToMove);
         $(this).off("click.moveConversationToTheTop");
       });

       $(`.person[data-chat=${divId}]`).click();

       //Step 06: emit realtime. Emit su kien len server

      }).fail(function(response){
        alertify.notify(response.responseText, "error", 7);
      })
    }
  })

}