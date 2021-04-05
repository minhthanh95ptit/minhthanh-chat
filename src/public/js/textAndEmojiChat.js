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
        let dataToEmit = {
          message: data.message
        };
        //Step 1: Handle message data before show
        let messageOfMe = $(` <div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());

        if(dataTextEmojiForSend.isChatGroup){
          messageOfMe.escapeHTML(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"`);
          //Thay vi data.message.html ta dung .text vi de tranh nguoi dung chen script len
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
          
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        }else{
          messageOfMe.html(convertEmojiMessage);
          dataToEmit.contactId = targetId;
        }
        //conver sang the image(emoji)
      
        // console.log(convertEmojiMessage)
     
        //Step 02: Append message data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe); 
        nineScrollRight(divId);

        //Step 3: remove all data input
        //Xoa 2 cho: input an va emojione 
       $(`#write-chat-${divId}`).val("");
       currentEmojioneArea.find(".emojionearea-editor").text("");

       //Step 4: change data in left side. preview message
      //  let momentTime = moment(timestamp).locale("vi").startOf("seconds").fromNow();
       $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
      
       $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

       //Step 5: Move conversation on top
       //click.move... de phan biet voi changeScreen
       $(`.person[data-chat=${divId}]`).on("minhthanh.moveConversationToTheTop", function(){
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("minhthanh.moveConversationToTheTop");
      });
  
      // $(`.person[data-chat=${divId}]`).click();
      $(`.person[data-chat=${divId}]`).trigger("minhthanh.moveConversationToTheTop");

       //Step 06: emit realtime. Emit su kien len server
       socket.emit("chat-text-emoji", dataToEmit);
       console.log(dataToEmit);
      }).fail(function(response){
        alertify.notify(response.responseText, "error", 7);
      })
    }
  })

}

$(document).ready(function(){
  socket.on("response-chat-text-emoji", function(response){
    // console.log("------------------------------------------------------");
    let divId = ""
    //step 01: handle message data before show
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());
    // console.log(response.message);
    // console.log(convertEmojiMessage);

    if(response.currentGroupId){
      // messageOfYou.escapeHTML(`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response .message.sender.name}"`);
      //Thay vi data.message.html ta dung .text vi de tranh nguoi dung chen script len
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;

      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);
      
      divId = response.currentGroupId;

      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    }else{
      messageOfYou.html(convertEmojiMessage);

      divId = response.currentUserId;
    }
    // console.log(messageOfYou);
    //Step 02: Append message data to screen
    // console.log(divId);
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou); 
      nineScrollRight(divId);
      increaseNumberMessageGroup(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
    }
    
    //Step 3: remove all data input
    //Xoa 2 cho: input an va emojione  
    //Khong can thiet o man hinh cua nguoi nhan

    //Step 4: change data in left side. preview message
  //  let momentTime = moment(timestamp).locale("vi").startOf("seconds").fromNow();
    $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
  
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    //Step 5: Move conversation on top
    //click.move... de phan biet voi changeScreen
    //Khong nen dung "click" vi nhu the se move ca khi chua gui tin nhan
    $(`.person[data-chat=${divId}]`).on("minhthanh.moveConversationToTheTop", function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("minhthanh.moveConversationToTheTop");
    });

    // $(`.person[data-chat=${divId}]`).click();
    $(`.person[data-chat=${divId}]`).trigger("minhthanh.moveConversationToTheTop");
    // console.log("Ket thuc 1 vong luan quan ..........................");
  });

})