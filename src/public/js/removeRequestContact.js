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

        socket.emit("remove-request-contact",{contactId: targetId});
      }
    })
  })
}

socket.on("response-remove-request-contact", function(user){
  $(".noti_content").find(`div[data-uid= ${user.id}]`).remove();
  $("ul.list-nofifications").find(`li>div[data-uid = ${user.id}]`).parent().remove()
  //Xoa o modal tab yeu cau ket ban
  decreaseNumberNotisContact("count-request-contact-received")
  
  decreaseNumberNotification("noti_contact_counter")
  decreaseNumberNotification("noti_counter")
})