function markNotificationsAsRead(targetUsers){
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: {targetUsers: targetUsers},
    success: function(result){
      if(result){
        targetUsers.forEach(function(uid){
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false")
          $("ul.list-notifications").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false")
        })
      }
      decreaseNumberNotification("noti_counter", targetUsers.length);
    }
  });
}

//each - JQuery
// FOreach - JS thuan


$(document).ready(function(){
  // link at popup notifications
  $("#popup-mark-notif-as-read").bind("click", function(){
    let targetUsers = [];
    $(".noti_content").find("div.notif-readed-false").each(function(index, notification){
      targetUsers.push($(notification).data("uid"));
    });
    // console.log(targetUsers)
    if(!targetUsers.length){
      alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
      return false; 
    }
    markNotificationsAsRead(targetUsers);
  });
  // link at modal notifications
  $("#modal-popup-mark-notif-as-read").bind("click", function(){
    let targetUsers = [];
    $(".list-notifications").find("li>div.notif-readed-false").each(function(index, notification){
      targetUsers.push($(notification).data("uid"));
    });

    if(!targetUsers.length){
      alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
      return false; 
    }
    markNotificationsAsRead(targetUsers);
  })
})