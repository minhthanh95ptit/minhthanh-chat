function attachmentChat(divId){
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function(){
    let fileData = $(this).prop("files")[0]

    //byte = 1mb
    let limit = 1048576

    if(fileData.size > limit){
      alertify.notify("File updload có dung lượng vượt tối đa cho phép", "error", 7)
      $(this).val(null)
      return false
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;
    // console.log(targetId);

    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data){
        let dataToEmit = {
          message: data.message
        };
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
       
        let attachmentChat = `<a href="data:${data.message.file.contentType}; base64,<${bufferToBase64(data.message.file.data)}" download="${data.message.file.fileName}">
          ${data.message.file.fileName}
        </a>`;
         
        if(isChatGroup){
          messageOfMe.escapeHTML(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"`);
          //Thay vi data.message.html ta dung .text vi de tranh nguoi dung chen script len
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
          
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        }else{
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId;
        }

         //Step 02: Append message data to screen
         $(`.right .chat[data-chat=${divId}]`).append(messageOfMe); 
         nineScrollRight(divId); 

        //Step 3: remove all data input
        //Khong co gi ca
        //Step 4: change data in left side. preview message
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime")
        .html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        //Step 5: Move conversation on top
        //click.move... de phan biet voi changeScreen
        $(`.person[data-chat=${divId}]`).on("minhthanh.moveConversationToTheTop", function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("minhthanh.moveConversationToTheTop");
        });

        $(`.person[data-chat=${divId}]`).trigger("minhthanh.moveConversationToTheTop");

        //Step 06: emit realtime. Emit su kien len server
        socket.emit("chat-attachment", dataToEmit);

        //Step 7 + 8(Typing): Nothing to code
        //Step 9: Add to model image
        let attachmentChatToAddModal = `<li>
        <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data)}" 
            download="${data.message.file.fileName}">
            ${data.message.file.fileName}
        </a>
      </li>`;;

        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);

      },
      error: function(error){
        alertify.notify(error.responseText, "error", 7);
      }
    })
  })
}


$(document).ready(function(){
  socket.on("response-chat-attachment", function(response){
    let divId = ""
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    
    let attachmentChat = `<a href="data:${response.message.file.contentType}; base64,<${bufferToBase64(response.message.file.data)}" download="${response.message.file.fileName}">
        ${response.message.file.fileName}
      </a>`;

    if(response.currentGroupId){
      // messageOfYou.escapeHTML(`<img src="/attachments/users/${response.message.sender.avatar}" class="avatar-small" title="${response .message.sender.name}"`);
      //Thay vi data.message.html ta dung .text vi de tranh nguoi dung chen script len
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;

      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
      
      divId = response.currentGroupId;

      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
        increaseNumberMessageGroup(divId);
      }
    }else{
      messageOfYou.html(attachmentChat);

      divId = response.currentUserId;

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
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
  
      $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");
  
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

       //Step 7 + 8(Typing): Nothing to code
      //Step 9: Add to model image
      let attachmentChatToAddModal = `<li>
          <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data)}" 
              download="${data.message.file.fileName}">
              ${data.message.file.fileName}
          </a>
      </li>`;

      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
    }
  })
})

