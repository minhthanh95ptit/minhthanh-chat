import mongoose from "mongoose"

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: {type: Number, min: 3, max: 177},
  messageAmount: {type: Number, default: 0},
  userId: String,
  members:[
    {userId: String}
  ],   
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit){
    return this.find({
      //elemMatch -> neu co phan tu trong mang thoa man dieu kien thi lay ca array do
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"createdAt": -1}).limit(limit).exec(); 
  }
}
// user de so it thoi
module.exports = mongoose.model("chat-group", ChatGroupSchema); 
