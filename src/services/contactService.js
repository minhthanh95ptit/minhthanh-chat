import ContactModel from "./../models/contactModel"
import UserModel from "./../models/userModel"
import NotificationModel from "./../models/notificationModel"
import _ from "lodash"

const LIMIT_NUMBER_TAKEN = 10;

let findUsersContact = (currentUserId, keyword) =>{
  return new Promise( async (resolve, reject) =>{
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) =>{
      deprecatedUserIds.push(contact.userId)
      deprecatedUserIds.push(contact.contactId)
    })

    // console.log(deprecatedUserIds)
    deprecatedUserIds = _.uniqBy(deprecatedUserIds)
    
    let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword)

    // console.log(deprecatedUserIds);
    // console.log(users);

    resolve(users)
  })
}

let addNew = (currentUserId, contactId) =>{
  return new Promise( async (resolve, reject) =>{
   let contactExits = await ContactModel.checkExists(currentUserId, contactId)

   if(contactExits){
     return reject(false)
   }

   let newContactItem = {
     userId: currentUserId,
     contactId: contactId
   }

   let newContact = await ContactModel.createNew(newContactItem);

   //create notification
   let notificationItem = {
     senderId: currentUserId,
     receiverId: contactId, 
     type: NotificationModel.types.ADD_CONTACT
   }

   await NotificationModel.model.createNew(notificationItem)
   
   resolve(newContact)
  })
}

let removeRequestContactSent = (currentUserId, contactId) =>{
  return new Promise( async (resolve, reject) =>{
   let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId)
   if(removeReq.result.n === 0){
     return reject(false)
   }
   //remove notification
   let notifTypeAddContact = NotificationModel.types.ADD_CONTACT
   await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, notifTypeAddContact)
   resolve(true)
  })
}

let removeRequestContactReceived = (currentUserId, contactId) =>{
  return new Promise( async (resolve, reject) =>{
   let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId)
   if(removeReq.result.n === 0){
     return reject(false)
   }
  //  //remove notification
  //  let notifTypeAddContact = NotificationModel.types.ADD_CONTACT
  //  await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, notifTypeAddContact)
   resolve(true)
  })
}

let getContacts = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
     let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
     let users = contacts.map(async (contact) =>{
       /* Luu y : ._id la objectID trong mongoDB*/
       // 1 cai la string, 1 cai la object. Nen dung 2 dau ==
      //  console.log(currentUserId, typeof currentUserId);
      //  console.log("---------------------------")
      //  console.log(contact.contactId, typeof contact.contactId);
        
       if(contact.contactId == currentUserId){
        return await UserModel.getNormalUserDataById(contact.userId);
       }
       else{
        return await UserModel.getNormalUserDataById(contact.contactId);
       }
     })

     resolve(await Promise.all(users));
   } catch (error) {
     reject(error)
   }
  })
}

let getContactsSent = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
    let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);
    let users = contacts.map(async (contact) =>{
      return await UserModel.getNormalUserDataById(contact.contactId);
    })

    resolve(await Promise.all(users));
   } catch (error) {
     reject(error)
   }
  })
}

let getContactsReceived = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
    let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
    let users = contacts.map(async (contact) =>{
      return await UserModel.getNormalUserDataById(contact.userId);
    })

    resolve(await Promise.all(users));
   } catch (error) {
     reject(error)
   }
  })
}

let countAllContacts = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
    let countContacts = await ContactModel.countAllContacts(currentUserId);
    resolve(countContacts);
   } catch (error) {
     reject(error)
   }
  })
};

let countAllContactsSent = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
    let countContacts = await ContactModel.countAllContactsSent(currentUserId);
    resolve(countContacts);
   } catch (error) {
     reject(error)
   }
  })
};

let countAllContactReceived = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
   try {
    let countContacts = await ContactModel.countAllContactReceived(currentUserId);
    resolve(countContacts);
   } catch (error) {
     reject(error)
   }
  })
};

let readMoreContacts = (currentUserId, skipNUmberContacts) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      // console.log("Service")
      let newContactUsers = await ContactModel.readMoreContacts(currentUserId, skipNUmberContacts, LIMIT_NUMBER_TAKEN)

      let users = newContactUsers.map(async (contact) =>{
        if(contact.contactId == currentUserId){
          return await UserModel.getNormalUserDataById(contact.userId);
         }
         else{
          return await UserModel.getNormalUserDataById(contact.contactId);
         }
      })
      // thuong su dung trong map, co nhieu promise ben trong
      resolve(await Promise.all(users))
      //resolve(notificationsUnread)
    }
    catch(error){
      reject(error)
    }
  })
}

let readMoreContactsSent = (currentUserId, skipNUmberContacts) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      // console.log("Service")
      let newContactUsers = await ContactModel.readMoreContactsSent(currentUserId, skipNUmberContacts, LIMIT_NUMBER_TAKEN)

      let users = newContactUsers.map(async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.contactId);
      })
      // thuong su dung trong map, co nhieu promise ben trong
      resolve(await Promise.all(users))
      //resolve(notificationsUnread)
    }
    catch(error){
      reject(error)
    }
  })
}

let readMoreContactsReceived = (currentUserId, skipNUmberContacts) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      // console.log("Service")
      let newContactUsers = await ContactModel.readMoreContactsReceived(currentUserId, skipNUmberContacts, LIMIT_NUMBER_TAKEN)

      let users = newContactUsers.map(async (contact) =>{
        return await UserModel.getNormalUserDataById(contact.userId);
      })
      // thuong su dung trong map, co nhieu promise ben trong
      resolve(await Promise.all(users))
      //resolve(notificationsUnread)
    }
    catch(error){
      reject(error)
    }
  })
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  removeRequestContactReceived: removeRequestContactReceived,
  getContacts: getContacts,
  getContactsSent: getContactsSent,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSent: countAllContactsSent,
  countAllContactReceived: countAllContactReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived
}
