let userAvatar = null
let userInfo = {} 
let originAvatarSrc = null
let originInfo = { }

function updateUserInfo(){
  $("#input-change-avatar").bind("change", function(){
    //Neu dang tham chieu den #input-change-avatar thi this = #input-change-avatar
    let fileData = $(this).prop("files")[0]
    let match = ["image/png", "image/jpg", "image/jpeg"]
    //byte = 1mb
    let limit = 1048576

    console.log(fileData)

    if($.inArray(fileData.type, match) === -1){
      alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg, png, jpeg", "error", 7)
      $(this).val(null)
      return false
    }

    if(fileData.size > limit){
      alertify.notify("Ảnh updload có dung lượng vượt tối đa cho phép", "error", 7)
      $(this).val(null)
      return false
    }

    if(typeof (FileReader) != "undefined"){
      let imagePreview = $("#image-edit-profile")
      imagePreview.empty()

      let fileReader = new FileReader()
      fileReader.onload = function(element){
        $("<img>",{
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview)
      }
      imagePreview.show()
      fileReader.readAsDataURL(fileData)

      let formData = new FormData()
      formData.append("avatar", fileData)

      userAvatar = formData
    }
    else{
      alertify.notify("Trình duyệt của bạn không hỗ trợ File Reader", "error", 7)
    }

    console.log(fileData)

  })

  $("#input-change-username").bind("change", function(){
    userInfo.username = $(this).val() //$(this).val() -> Nhap vao form
  })

  $("#input-change-gender-male").bind("click", function(){
    userInfo.gender = $(this).val() //$(this).val() -> Nhap vao form
  })

  $("#input-change-gender-female").bind("click", function(){
    userInfo.gender = $(this).val() //$(this).val() -> Nhap vao form
  })

  $("#input-change-address").bind("change", function(){
    userInfo.address = $(this).val() //$(this).val() -> Nhap vao form
  })

  $("#input-change-phone").bind("change", function(){
    userInfo.phone = $(this).val() //$(this).val() -> Nhap vao form
  })
} 

function callUpdateUserAvatar(){
  $.ajax({
    url: "/user/update-info",
    type: "put", //update truong du lieu
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result){
      console.log(result)

      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display", "block")

      // Update avatar
      $("#navbar-avatar").attr("src", result.imageSrc)
      
      //update origin avatar src
      originAvatarSrc = result.imageSrc
    },
    error: function(error){
      // Dislay errors
      console.log(error)
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display", "block")

      //reset all
      $("#input-btn-cancel-update-user").click()
    }
  })
}

function callUpdateUserInfo(){
  $.ajax({
    url: "/user/update-info",
    type: "put", //update truong du lieu
    data: userInfo,
    success: function(result){
      console.log(result)

      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display", "block")

      // update Origin User Info
      originUserInfo = Object.assign(originUserInfo, userInfo)

      // update user info
      $('#navbar-username').text(originUserInfo.username);
      
      //reset all
      $('#input-btn-cancel-update-user').click();
    },
    error: function(error){
      // Dislay errors
      console.log(error)
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display", "block")

      //reset all
      $("#input-btn-cancel-update-user").click()
    }
  })
}


$(document).ready(function(){
  updateUserInfo()

  originAvatarSrc = $("#user-modal-avatar").attr("src")

  originUserInfo = {
    username: $("input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female")),
    address: $("input-change-address").val(),
    phone: $("input-change-phone").val()
  }
  //update userinfo after change value to update
  updateUserInfo()

  $("#input-btn-update-user").bind("click", function(){

    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 7)
      return false
    }
    
    if(userAvatar){
      callUpdateUserAvatar()
    }

    if(!$.isEmptyObject(userInfo)){
      callUpdateUserInfo()
    }
   
  })


 

  $("#input-btn-cancel-update-user").bind("click", function(){
    userAvatar = null
    userInfo = {}

    $("#input-change-avatar").val(null)
    $("#user-modal-avatar").attr("src", originAvatarSrc)

    $("#input-change-username").val(originUserInfo.username)
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click()
    $("#input-change-address").val(originUserInfo.address)
    $("#input-change-phone").val(originUserInfo.phone)
  })
})
