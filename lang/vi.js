export const transValidation = {
  email_incorrect: "Email phải có dạng example example@mail.com",
  gender_incorrect: "Trường giơi tính bị lỗi !",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, cữ thường, chữ số, kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống",
  account_not_active: "Tài khoản đã được đăng ký nhưng chưa active. Vui lòng kiểm tra email hoặc liên hệ lại với CSKH.",
  token_undefined: "Token không tồn tại !",
  login_failed: "Sai tài khoản hoặc mật khẩu !",
  server_error: "Có lôi ở phía server. Vui lòng liên hệ CSKH.",
  avatar_type_error: "Kiểu file không hợp lệ, chỉ chấp nhận jpg, png, jpeg",
  avatar_size_error: "Ảnh updload có dung lượng vượt tối đa cho phép"
}

export const transSuccess = {
  userCreated: (userEmail) =>{
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để active tài khoản.`
  },
  account_actived: "Kích hoạt tài khoản thành công, bạn đã có thể đăng nhập vào ứng dụng.",
  loginSuccess: (username) =>{
    return `Xin chào ${username}`
  },
  logout_success: "Đăng xuất tài khoản thành công. Hẹn gặp lại bạn",
  avatar_updated: "Cập nhật ảnh đại diện thành công.",
  user_info_updated: "Cập nhật thông tin người dùng thành công."
}

export const transMail = {
  subject: "Awesome Chat: Xác nhận kích hoạt tài khoản",
  template: (linkVerify) =>{
    return `
      <h2>Bạn nhận được email này vì đã đăng ký tài khoản trên ứng dụng Awesome Chat</h2>
      <h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng email này là nhầm lẫn, hãy bỏ qua nó. Trân trọng.</h4>
    `
  },
  send_failed: "Có lỗi trong quá trình gửi email, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi"
}
