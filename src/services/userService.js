import userModel from "./../models/userModel"

let updateUser = (id, item) =>{
  return userModel.updateUserItem(id, item)
}

module.exports = {
  updateUser: updateUser
}
