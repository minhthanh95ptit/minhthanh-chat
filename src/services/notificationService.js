import NotificationModel from "./../models/notificationModel"
import UserModel from "./../models/userModel"
//Get notifications whten f5 page
// Just 10 item


const LIMIT_NUMBER_TAKEN = 10;

let getNotification = (currentUserId) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN)
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

// read More notifications

let readMore = (currentUserId, skipNumberNotification) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      // console.log("Service")
      let newNotifications = await NotificationModel.model.readMoreNotifications(currentUserId, skipNumberNotification, LIMIT_NUMBER_TAKEN)

      let getNotifContent = newNotifications.map(async (notification) =>{
        let sender = await UserModel.findUserById(notification.senderId)

        return NotificationModel.contents.getContent(notification.type,notification.isRead, sender._id, sender.username, sender.avatar)
      })
      // thuong su dung trong map, co nhieu promise ben trong
      resolve(await Promise.all(getNotifContent))
      //resolve(notificationsUnread)
    }
    catch(error){
      reject(error)
    }
  })
}
//targetUsers - array
// Mark all notificitions as read
let markAllAsRead = (currentUserId, targetUsers) =>{
  return new Promise(async (resolve, reject) =>{
    try{
       await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
       resolve(true)
    }
    catch(error){
      console.log(`Error when mark notifications as read: ${error}`)
      reject(false)
    }
  })
}
module.exports = {
  getNotification: getNotification,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
}