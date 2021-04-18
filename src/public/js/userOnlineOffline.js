//Step 01
socket.on("server-send-list-users-online", function(listUsersIds){
  listUsersIds.forEach(userId =>{
    console.log(userId);
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");

  })
}); 

//Step 02
socket.on("server-send-when-new-user-online", function(userId){
    $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
}); 

//Step 03
socket.on("server-send-when-new-user-offline", function(userId){
  $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online");
  $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
}); 