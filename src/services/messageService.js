import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from './../models/chatGroupModel';
import MessageModel from './../models/messageModel';
import {transErrors} from "./../../lang/vi";
import {app} from "./../config/app";

import _ from "lodash";


const LIMIT_CONVERSATIONS_TAKEN = 10;
const LIMIT_MESSAGES_TAKEN = 30;
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) =>{
    try{
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      // console.log(contacts);
      let userConversationsPromise = contacts.map(async (contact) =>{

        if(contact.contactId == currentUserId){ 
          let getUserContact =  await UserModel.getNormalUserDataById(contact.userId);

          getUserContact.updatedAt = contact.updatedAt;
          return getUserContact; 
        }
        else{
         return await UserModel.getNormalUserDataById(contact.contactId);
        }
      })
      let userConversations = await Promise.all(userConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      let allConversations = userConversations.concat(groupConversations);

      // console.log(userConversations);     
      // console.log(groupConversations);
      // console.log(getAllConversations);

      allConversations = _.sortBy(allConversations, (item) =>{
        return -item.createdAt;
      });

      //get messages to apply to screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation)=>{
        
        conversation = conversation.toObject();

        if(conversation.members){
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }
        else{
          console.log(currentUserId);
          console.log(conversation._id);
          console.log(LIMIT_MESSAGES_TAKEN);

          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
          
          console.log(getMessages);

          conversation.messages = _.reverse(getMessages);
          // console.log(conversation.messages)
        }
        //conversation map la array 
        //Muon bien ve object thi toObject moi  conversation.messages = getMessages; duoc

        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);

      // console.log(allConversationWithMessages);
      //sort By updatedAt
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) =>{
        return -item.updatedAt;
      })

      // console.log(allConversationWithMessages);
      resolve({
        allConversationWithMessages: allConversationWithMessages
      });
    }
    catch(error){
      reject(error);
    }
  })
};

/* 
sender: currentId
receiverId: id of and user or a group
messageVal: content message
isChatGroup: true/false
*/
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) =>{
  return new Promise(async (resolve, reject) =>{
    try{
      if(isChatGroup){
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);

        if(!getChatGroupReceiver){
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        }

        // console.log(sender.id);

        let newMessageItems = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.GROUP,
          messageType: MessageModel.messageType.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }; 
        console.log(newMessageItems);

        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItems);
        //update group chat
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
        resolve(newMessage);
      }
      else{
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);

        if(!getUserReceiver){
          return reject(transErrors.conversation_not_found);
        }

        // console.log(getUserReceiver);
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        // console.log(sender);

        let newMessageItems = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationType.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }; 

        // console.log(newMessageItems);
        //create new Message
        let newMessage = await MessageModel.model.createNew(newMessageItems);
        // console.log(newMessage);
        //update contact
        let result = await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);
        // console.log(result);
        resolve(newMessage);
      }
    }
    catch(error){
      reject(error);
    }
  })
};


module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji
}