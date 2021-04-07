function imageChat(divId){
  $(`#image-chat-${divId}`).unbind("change").on("change", function(){
    let fileData = $(this).prop("files")[0]

    // console.log(fileData);
    
    let match = ["image/png", "image/jpg", "image/jpeg"]
    //byte = 1mb
    let limit = 1048576

    if($.inArray(fileData.type, match) === -1){
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg, png, jpeg", "error", 7)
      $(this).val(null)
      return false
    }

    // console.log(fileData.size)

    if(fileData.size > limit){
      alertify.notify("Ảnh updload có dung lượng vượt tối đa cho phép", "error", 7)
      $(this).val(null)
      return false
    }

    let targetId = $(this).data("chat");

    // console.log(targetId);

    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")){
      messageFormData.append("isChatGroup", true);
    }


    // console.log(messageFormData);

    $.ajax({
      url: "/message/add-new-image",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data){
        console.log(data);
      },
      error: function(error){
        alertify.notify(error.responseText, "error", 7);
      }
    })

  })
}