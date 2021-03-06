import mongoose from "mongoose"

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String, 
    name: String,
    avatar: String
  },
  receiver:{
    id: String, 
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

MessageSchema.statics = {
 createNew(item){
  return this.create(item);
  },
  /*
  senderID: currentUserId  
  */
  getMessagesInPersonal(senderId, receiverId, limit){
    return this.find({
      $or:[
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"senderId": receiverId},
          {"receiverId": senderId}
        ]}
      ]
    }).sort({ createdAt: -1}).limit(limit).exec();
  },
  //receiverId : Id cua 1 group chat cu the
  getMessagesInGroup(receiverId, limit){
    return this.find({"receiverId": receiverId }).sort({"createdAt": -1}).limit(limit).exec();
  },
  updateWhenHasNewMessage(id, newMessageAmount){
    return this.findByIdAndUpdate(id, {
      "messageAmount": newMessageAmount,
      "updatedAt": Date.now()

    }).exec();
  }
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group"
}

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
}
// user de so it thoi
module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationType: MESSAGE_CONVERSATION_TYPES,
  messageTypes: MESSAGE_TYPES
}