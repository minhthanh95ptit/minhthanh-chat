function removeRequestContact(){
  $(".user-remove-request-contact").bind("click",function(){
    let targetId = $(this).data("uid")
    //delete thi dung ajax
    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: {uid: targetId},
      success: function(data){
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
        $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();

        decreaseNumberNotisContact("count-request-contact-sent")

        //Xoa o modal dang cho xac nhan
        $("#request-contact-send").find(`li[data-uid = ${targetId}]`).remove();


        socket.emit("remove-request-contact",{contactId: targetId});
      }
    })
  })
}

socket.on("response-remove-request-contact", function(user){
  $(".noti_content").find(`div[data-uid= ${user.id}]`).remove();
  $("ul.list-nofifications").find(`li>div[data-uid = ${user.id}]`).parent().remove()
  //Xoa o modal tab yeu cau ket ban

  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotisContact("count-request-contact-received")
  
  decreaseNumberNotification("noti_contact_counter", 1)
  decreaseNumberNotification("noti_counter", 1)
})