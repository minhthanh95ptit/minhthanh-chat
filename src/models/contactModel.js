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
  removeRequestContact(userId,contactId){
    return this.remove({
      $and:[
        {"userId": userId},
        {"contactId": contactId},
      ]
    }).exec()
  },
  getContacts(userId, limit){
    return this.find({
      $and:[
        {"userId": userId},
        {"status": true}
      ]
    }).sort({"createdAd": -1}).limit(limit).exec()
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
        {"contactId ": userId},
        {"status": false}
      ]
    }).sort({"createdAd": -1}).limit(limit).exec()
  } 
}
module.exports = mongoose.model("contact", ContactSchema);
