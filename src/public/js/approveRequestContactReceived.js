function approveRequestContactReceived(){
  $(".user-approve-request-contact-received").unbind("click").on("click",function(){
    let targetId = $(this).data("uid")
    //delete thi dung ajax
    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: {uid: targetId},
      success: function(data){
        if(data.success){
          let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);

          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel").append(`
            <div class="user-talk" data-uid="${targetId}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${targetId}">
                Xóa liên hệ
            </div>
          `);
      
          //lay html cua the li
          let userInfoHtml = userInfo.get(0).outerHTML;
      
          //prepend -> len tren cung
          //append -> xuong duoi cung
          $("#contacts").find("ul").prepend(userInfoHtml);
           
          $(userInfo).remove()
      
          decreaseNumberNotisContact("count-request-contact-received");
          decreaseNumberNotification("noti_contact_counter", 1);
          increaseNumberNotisContact("count_contacts");

          socket.emit("approve-request-contact-received",{contactId: targetId});
        }
      }
    })
  })
}

socket.on("response-approve-request-contact-received", function(user){
  let notif = `<div class="notif-readed-false" data-uid="${ user.id }">
      <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
      <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn
      </div>`;
    
  $(".noti_content").prepend(notif);
  $("ul.list-notifications").prepend(`<li>${notif}</li>`);

  //BEN PHIA NGUOI GUI REQUEST KET BAN
  decreaseNumberNotisContact("noti_contact_counter", 1); 
  increaseNumberNotification("noti_counter", 1)

  decreaseNumberNotification("count-request-contact-sent", 1);
  increaseNumberNotisContact("count_contacts");

  $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();

  let userInfoHtml = `
        <li class="_contactList" data-uid="${user.id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                  ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
  `;
  $("#contacts").find("ul").prepend(userInfoHtml);
})

$(document).ready(function(){
  approveRequestContactReceived()
})