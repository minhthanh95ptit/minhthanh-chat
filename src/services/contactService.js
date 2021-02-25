import ContactModel from "./../models/contactModel"
import UserModel from "./../models/userModel"
import _ from "lodash"


let findUsersContact = (currentUserId, keyword) =>{
  return new Promise( async (resolve, reject) =>{
    let deprecatedUserIds = [];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) =>{
      deprecatedUserIds.push(contact.userId)
      deprecatedUserIds.push(contact.contactId)
    })

    console.log(deprecatedUserIds)
    deprecatedUserIds = _.uniqBy(deprecatedUserIds)
    
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword)

    resolve(users)
  })
}

module.exports = {
  findUsersContact: findUsersContact
}