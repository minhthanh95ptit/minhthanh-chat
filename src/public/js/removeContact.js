function removeContact(){
  $(".user-remove-contact").unbind("click").on("click", function(){
    let targetId = $(this).data("uid") //data-uid
    let userName = $(this).parent().find("div.user-name p").text();
    console.log(targetId)

    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${userName} khỏi danh bạ ?`,
      text: "Bạn không thể hoàn tác lại quá trình này",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value){
        return false
      }
      $.ajax({
        url: "/contact/remove-contact",
        type: "delete",
        data: {uid: targetId},
        success: function(data){
          if(data.success){
            $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
            decreaseNumberNotisContact("count-contacts");

            socket.emit("remove-contact",{contactId: targetId});
          }
        }
      })
    })

  })
}


socket.on("response-remove-contact", function(user){
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
  decreaseNumberNotisContact("count-contacts");
})


$(document).ready(function(){
  removeContact()
})