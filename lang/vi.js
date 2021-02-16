export const transValidation = {
  email_incorrect: "Email phải có dạng example example@mail.com",
  gender_incorrect: "Trường giơi tính bị lỗi !",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, cữ thường, chữ số, kí tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mật khẩu chưa chính xác",
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng",
  account_removed: "Tài khoản này đã bị gỡ khỏi hệ thống",
  account_not_active: "Tài khoản đã được đăng ký nhưng chưa active. Vui lòng kiểm tra email hoặc liên hệ lại với CSKH."
}

export const transSuccess = {
  userCreated: (userEmail) =>{
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để active tài khoản.`
  }
}