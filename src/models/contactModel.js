import mongoose from "mongoose"

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type:Boolean, default: false}, 
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
})
// user de so it thoi

ContactSchema.statics = {
  createNew(item){
    return this.create(item) // return Promise so onece will use async/await
  },
  //phai check or 2 dau, ca nguoi nhan va nguoi gui req (status true)
  removeContact(userId, contactId){
    return this.remove({
      $or:[
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec()
  },
  findAllByUser(userId){
    return this.find({
      $or:[
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec()
  },
  //Kiem tra ton tai 2 user
  checkExists(userId, contactId){
    return this.findOne({
      $or:[
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },
  removeRequestContactSent(userId,contactId){
    return this.remove({
      $and:[
        {"userId": userId},
        {"contactId": contactId},
        {"status": false}
      ]
    }).exec()
  },
  removeRequestContactReceived(userId,contactId){
    return this.remove({
      $and:[
        {"userId": contactId},
        {"contactId": userId},
        {"status": false}
      ]
    }).exec()
  },
  approveRequestContactReceived(userId, contactId){
    return this.update({
      $and:[
        {"userId": contactId},
        {"contactId": userId},
        {"status": false}
      ]
    }, { 
      "status": true,
      "updatedAt": Date.now()
    }).exec()
  },
  getContacts(userId, limit){ //hien thi danh ba
    return this.find({
      $and:[
        // Minh gui cho ngta hoac ngta gio cho minh deu duoc
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": 1}).limit(limit).exec()
  },
  // status = true -> da la ban be
  // status = false -> chua la ban be, tuc ma gui nhung chua dong y
  getContactsSent(userId, limit){
    return this.find({
      $and:[
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAd": -1}).limit(limit).exec()
  },
  // Minh nhan duoc tuc la minh la contactID cua nguoi khac
  getContactsReceived(userId, limit){
    return this.find({
      $and:[
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAd": -1}).limit(limit).exec()
  },
  countAllContacts(userId){
    return this.count({
      $and:[
        // Minh gui cho ngta hoac ngta gio cho minh deu duoc
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec()
  },
  // status = true -> da la ban be
  // status = false -> chua la ban be, tuc ma gui nhung chua dong y
  countAllContactsSent(userId){
    return this.count({
      $and:[
        {"userId": userId},
        {"status": false}
      ]
    }).exec()
  },
  // Minh nhan duoc tuc la minh la contactID cua nguoi khac
  countAllContactReceived(userId){
    return this.count({
      $and:[
        {"contactId": userId},
        {"status": false}
      ]
    }).exec()
  },
  readMoreContacts(userId, skip, limit){
    return this.find({
      $and: [
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": -1}).skip(skip).limit(limit).exec();
  },
  readMoreContactsSent(userId, skip, limit){
    return this.find({
      $and:[
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },
  readMoreContactsReceived(userId, skip, limit){
    return this.find({
      $and:[
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },
  updateWhenHasNewMessage(userId, contactId){
    return this.update({
      $or:[
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    },{
      "updatedAt": Date.now()
    }).exec();
  },
  //Get contct friends by UserId
  getFriends(userId, limit){ //hien thi danh ba
    return this.find({
      $and:[
        // Minh gui cho ngta hoac ngta gio cho minh deu duoc
        {$or:[
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updatedAt": 1}).limit(20).exec()
  },
}

module.exports = mongoose.model("contact", ContactSchema);
