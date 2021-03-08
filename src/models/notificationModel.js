import mongoose from "mongoose"

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String, 
  type: String,
  isRead: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now}

})

NotificationSchema.statics = {
  createNew(item){
    return this.create(item) // return Promise so onece will use async/await
  },
  removeRequestContactNotification(senderId, receiverId, type){
    return this.remove({
      $and:[
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec()
  },
  //Return ban ghi co gioi han
  getByUserIdAndLimit(userId, limit){
    // -1 sap xep tu moi ve cu
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).limit(limit).exec()
  },
  countNotifUnread(userId){
    return this.count({
      $and:[
        {"receiverId": userId},
        {"isRead":false}
      ]
    }).exec() 
  },
  readMoreNotifications(userId, skip, limit){
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec()
  }
}

const NOTIFICATION_TYPE = {
  ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, userName, userAvatar) =>{
    if(notificationType === NOTIFICATION_TYPE.ADD_CONTACT){
      if(!isRead){
        return `<div class="notif-readed-false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
        <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
        </div>`
      }
      return `<div data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
      <strong>${ userName }</strong> đã gửi cho bạn một lời mời kết bạn!
      </div>`
    }
    return "No matching with any notification type";
  }
}
// user de so it thoi
module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPE,
  contents: NOTIFICATION_CONTENTS
}
