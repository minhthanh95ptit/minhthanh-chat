let userAvatar = null
let userInfo = {} 
let originAvatarSrc = null
let originUserInfo = {}
let userUpdatePassword = {}


function callLogOut(){
  let timeInterval;
  Swal.fire({
    position: "top-end",
    title: "Tự động đăng xuất sau 5 giây ",
    html: "Thời gian <strong></strong>",
    timer: 5000,
    onBeforeOpen: () =>{
      Swal.showLoading()
      timeInterval = setInterval(() =>{
        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000)
      }, 1000);
    },
    onClose: () =>{
      clearInterval(timeInterval)
    }
  }).then((result) =>{
    $.get("/logout", function(){
      location.reload()
    })
  })
}

function updateUserInfo(){
  $("#input-change-avatar").bind("change", function(){
    //Neu dang tham chieu den #input-change-avatar thi this = #input-change-avatar
    let fileData = $(this).prop("files")[0]
    let match = ["image/png", "image/jpg", "image/jpeg"]
    //byte = 1mb
    let limit = 1048576

    // console.log(fileData)

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

    // console.log(fileData)

  })

  $("#input-change-username").bind("change", function(){
    let username = $(this).val() //$(this).val() -> Nhap vao form
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)

    if (!regexUsername.test(username) || username.length < 3 || username.length > 17){
      alertify.notify("Giới hạn 3- 17 kí tự và không được chứa kí tự đặc biệt", "error", 6)
      $(this).val(originUserInfo.username)
      delete userInfo.username
      return false 
    }
    userInfo.username = username
  })

  $("#input-change-gender-male").bind("click", function(){
    let gender = $(this).val() //$(this).val() -> Nhap vao form

    if(gender !== "male"){
      alertify.notify("Giới tính bị sai", "error", 6)
      $(this).val(originUserInfo.gender)
      delete userInfo.gender
      return false 
    }
    userInfo.gender = gender
  })

  $("#input-change-gender-female").bind("click", function(){
    let gender = $(this).val() //$(this).val() -> Nhap vao form

    if(gender !== "female"){
      alertify.notify("Giới tính bị sai", "error", 6)
      $(this).val(originUserInfo.gender)
      delete userInfo.gender
      return false 
    }
    userInfo.gender = gender
  })

  $("#input-change-address").bind("change", function(){
    let address = $(this).val() //$(this).val() -> Nhap vao form
    if(address.length < 3 || address > 30){
      alertify.notify("Địa chỉ giới hạn trong 3-30 kí tự", "error", 6)
      $(this).val(originUserInfo.address)
      delete userInfo.address
      return false 
    }
    userInfo.address = address
  })

  $("#input-change-phone").bind("change", function(){
    let phone = $(this).val() //$(this).val() -> Nhap vao form
    let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/)

    if (!regexPhone.test(phone)){
      alertify.notify("Số điện thoại Việt Nam bắt đâu bằng số 0, giới hạn 10-11 kí tự", "error", 6)
      $(this).val(originUserInfo.phone)
      delete userInfo.phone
      return false 
    }
    userInfo.phone = phone
  })
  
  $("#input-change-current-password").bind("change", function(){
    let currentPassword = $(this).val() //$(this).val() -> Nhap vao form
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)

    if (!regexPassword.test(currentPassword)){
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, cữ thường, chữ số, kí tự đặc biệt", "error", 6)
      $(this).val(null)
      delete userUpdatePassword.currentPassword
      return false 
    }
    userUpdatePassword.currentPassword = currentPassword
    // console.log(userUpdatePassword)

  })

  $("#input-change-new-password").bind("change", function(){
    let newPassword = $(this).val() //$(this).val() -> Nhap vao form
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/)

    if (!regexPassword.test(newPassword)){
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, cữ thường, chữ số, kí tự đặc biệt", "error", 6)
      $(this).val(null)
      delete userUpdatePassword.newPassword
      return false 
    }
    userUpdatePassword.newPassword = newPassword
  }) 

  $("#input-change-confirm-new-password").bind("change", function(){
    let confirmNewPassword = $(this).val();

    if(!userUpdatePassword.newPassword){
      alertify.notify("Bạn chưa nhập mật khẩu mới","error", 7)
      $(this).val(null)
      delete userUpdatePassword.newPassword
      return false 
    }

    if(confirmNewPassword !== userUpdatePassword.newPassword){
      alertify.notify("Nhập lại mật khẩu chưa chính xác","error", 7)
      $(this).val(null)
      delete userUpdatePassword.confirmNewPassword
      return false 
    }

    userUpdatePassword.confirmNewPassword = confirmNewPassword
  })
} 

function callUpdateUserAvatar(){
  $.ajax({
    url: "/user/update-avatar",
    type: "put", //update truong du lieu
    cache: false, // just use for upload file
    contentType: false,// just use for upload file
    processData: false,// just use for upload file
    data: userAvatar,
    success: function(result){
      // console.log(result)

      $(".user-modal-alert-success").find("span").text(result.message)
      $(".user-modal-alert-success").css("display", "block")

      // Update avatar
      $("#navbar-avatar").attr("src", result.imageSrc)
      updateInfo
      //update origin avatar src
      originAvatarSrc = result.imageSrc

      //reset all
      $("#input-btn-cancel-update-user").click()
    },
    error: function(error){
      // Dislay errors
      // console.log(error)
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
      // console.log(error)
      $(".user-modal-alert-error").find("span").text(error.responseText)
      $(".user-modal-alert-error").css("display", "block")

      //reset all
      $("#input-btn-cancel-update-user").click()
    }
  })
}

function callUpdateUserPassword(){
  $.ajax({
    url: "/user/update-password",
    type: "put", //update truong du lieu
    data: userUpdatePassword,
    success: function(result){

      $(".user-modal-password-alert-success").find("span").text(result.message)
      $(".user-modal-password-alert-success").css("display", "block")
      $('#input-btn-cancel-update-user-password').click();

      //Log out after change password success
      callLogOut()
    },
    error: function(error){
      // Dislay errors
      $(".user-modal-password-alert-error").find("span").text(error.responseText)
      $(".user-modal-password-alert-error").css("display", "block")

      //reset all
      $("#input-btn-cancel-update-user-password").click()
    }
  })
}

$(document).ready(function(){

  originAvatarSrc = $("#user-modal-avatar").attr("src")

  originUserInfo = {
    username: $("input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val()),
    address: $("input-change-address").val(),
    phone: $("input-change-phone").val()
  }
  //update user info after change value to update
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

    $("#user-modal-avatar").attr("src", originAvatarSrc)
    $("#input-change-avatar").val(null)
  
    //return old data 
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
  })

  $("#input-btn-update-user-password").bind("click", function(){
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword){
      alertify.notify("Bạn phải thay đổi đầy đủ thông tin", "error",6)
      return false
    }
    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đổi mật khẩu?",
      text: "Bạn không thể hoàn tác lại quá trình này",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#FF7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value){
        $("#input-btn-cancel-update-user-password").click()
        return false
      }
      callUpdateUserPassword()
    })

  })

  $("#input-btn-cancel-update-user-password").bind("click", function(){
    userUpdatePassword = {}
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  })
})

