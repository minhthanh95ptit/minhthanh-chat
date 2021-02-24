import userModel from "./../models/userModel"
import {transErrors} from "./../../lang/vi"
import bcrypt from "bcrypt"

const saltRounds = 7

let updateUser = (id, item) =>{
  return userModel.updateUserItem(id, item)
}

let updatePassword = (id, dataUpdate) =>{
  return new Promise(async (resolve, reject) =>{
    let currentUser = await userModel.findUserById(id)

    console.log(currentUser)
    if(!currentUser){
      return reject(transErrors.account_undefined)
    }

    let checkCurrentpassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    console.log(checkCurrentpassword)

    if(!checkCurrentpassword){
      return reject(transErrors.user_current_password_wrong);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    
    await userModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt))

    resolve(true)

  })
}
module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
}
