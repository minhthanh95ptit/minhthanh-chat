import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from './../models/chatGroupModel';
import MessageModel from './../models/messageModel';

import _ from "lodash";

const LIMIT_CONVERSATIONS_TAKEN = 10;
const LIMIT_MESSAGES_TAKEN = 30;
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) =>{
    try{
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
      let userConversationsPromise = contacts.map(async (contact) =>{

        if(contact.contactId == currentUserId){ 
          let getUserContact =  await UserModel.getNormalUserDataById(contact.userId);

          getUserContact.createdAt = contact.createdAt;
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
          conversation.messages = getMessages;
        }
        else{
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
          conversation.messages = getMessages;
        }
        //conversation map la array 
        //Muon bien ve object thi toObject moi  conversation.messages = getMessages; duoc

        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);

      console.log(allConversationWithMessages);
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


module.exports = {
  getAllConversationItems: getAllConversationItems
}