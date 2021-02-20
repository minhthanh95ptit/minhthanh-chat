let userAvatar = null
let userInfo = {} 
let originAvatarSrc = null

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

$(document).ready(function(){
  updateUserInfo()

  originAvatarSrc = $("#user-modal-avatar").attr("src")
  $("#input-btn-update-user").bind("click", function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu.", "error", 7)
      return false
    }
    // console.log(userAvatar)
    // console.log(userInfo)
    $.ajax({
      url: "/user/update-avatar",
      type: "put", //update truong du lieu
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result){
        //
      },
      error: function(error){
        //
      }
    })
  })

  $("#input-btn-cancel-update-user").bind("click", function(){
    userAvatar = null
    userInfo = {}

    $("#user-modal-avatar").attr("src", originAvatarSrc)
  })
})