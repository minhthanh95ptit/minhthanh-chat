function removeRequestContactReceived(){
  $(".user-remove-request-contact-received").unbind("click").on("click",function(){
    let targetId = $(this).data("uid")
    //delete thi dung ajax
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: {uid: targetId},
      success: function(data){
        //Chuc nang xoa thong bao || khong can thiet
        // $(".noti_content").find(`div[data-uid= ${user.id}]`).remove();
        // $("ul.list-nofifications").find(`li>div[data-uid = ${user.id}]`).parent().remove()
  
        //cap nhat realtime khi remove request received
        decreaseNumberNotification("noti_contact_counter", 1)

        decreaseNumberNotisContact("count-request-contact-received") //js/caculateNotifContact

        //Xoa o modal dang yeu cau ket ban
        $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();


        socket.emit("remove-request-contact-received",{contactId: targetId});
      }
    })
  })
}

socket.on("response-remove-request-contact-received", function(user){
  // console.log(user);
  // Do man hinh cua nguoi gui can xu ly nen 2 dong an/hien nay phai cho vao socket
  $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");
  $("#find-user").find(`div.user-remove-request-contact-received[data-uid = ${user.id}]`).hide();
  //Xoa o modal tab yeu cau ket ban

  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotisContact("count-request-contact-received")
  
  decreaseNumberNotification("noti_contact_counter", 1)
  decreaseNumberNotification("noti_counter", 1)
})

$(document).ready(function(){
  removeRequestContactReceived()
})