import NotificationModel from "./../models/notificationModel"
import UserModel from "./../models/userModel"
//Get notifications whten f5 page
// Just 10 item

let getNotification = (currentUserId, limit = 10) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit)
      // console.log(notifications)
      let getNotifContent = notifications.map(async (notification) =>{
        let sender = await UserModel.findUserById(notification.senderId)

        return NotificationModel.contents.getContent(notification.type,notification.isRead, sender._id, sender.username, sender.avatar)
      })
      // thuong su dung trong map, co nhieu promise ben trong
      resolve(await Promise.all(getNotifContent))
      // resolve(getNotifContent)
    }
    catch(error){
      reject(error)
    }
  })
};

//Count all notification unread
let countNotifUnread = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId)

      // console.log(notificationsUnread)
      resolve(notificationsUnread)
    }
    catch(error){
      reject(error)
    }
  })
};

module.exports = {
  getNotification: getNotification,
  countNotifUnread: countNotifUnread
}