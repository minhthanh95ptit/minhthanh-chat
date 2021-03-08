$(document).ready(function(){
  $("#link-read-more-notif").bind("click", function(){
    let skipNumber = $("ul.list-notifications").find("li").length;
    
    $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications){
      // console.log(notifications)
      if(!notifications.length){
        alertify.notify("Bạn không còn thông báo nào nữa.", "error", 7);
        return false;
      }
      notifications.forEach(function(notification){
          $("ul.list-notifications").append(`<li>${notification}</li>`)
      })
    });

  })
})