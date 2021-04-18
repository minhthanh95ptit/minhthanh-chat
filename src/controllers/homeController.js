import {notifcation, contact, message} from "./../services/index"
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper"
import request from "request";

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) =>{
    // let o = {
    //   format: "urls"
    // };

    // let bodyString = JSON.stringify(o);

    // let options = {
    //   url: "https://global.xirsys.net/_turn/kid1412ubqn",
    //   method: "PUT",
    //   headers: {
    //       "Authorization": "Basic " + Buffer.from("kid1412ubqn:a38fda72-9ec6-11eb-9efa-0242ac150003").toString("base64"),
    //       "Content-Type": "application/json",
    //       "Content-Length": bodyString.length
    //   }
    // };
    // //Call a request to get ICE list of turn server

    // request(options, (error, response, body) =>{
    //   if(error){
    //     console.log("Error when get ICE list:" + error);
    //     return reject(error);
    //   }
    //   let bodyJson = JSON.parse(body);
    //   // console.log(bodyJson);
    //   resolve(bodyJson.v.iceServers);
    // })
    resolve([]);
  });
};

let getHome = async (req, res) =>{
  //Only 10 items (one time)
  let notifications = await notifcation.getNotification(req.user._id)
  // Get Amount notifications unread
  let countNotifUnread = await notifcation.countNotifUnread(req.user._id)

  // Get Amount contacts Only 10 items (one time)
  let contacts = await contact.getContacts(req.user._id);

  //get contacts sent
  let contactsSent = await contact.getContactsSent(req.user._id);

  //get contacts receiverd
  let contactsReceived = await contact.getContactsReceived(req.user._id);

  // // console.log(req.user);
  // console.log(contacts)
  // console.log(contactsSent)
  // console.log(contactsReceived)

  //count contacts 
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
  let countAllContactReceived = await contact.countAllContactReceived(req.user._id);

  let getAllConversationItems = await  message.getAllConversationItems(req.user._id);

  let allConversations = getAllConversationItems.allConversations;
  let userConversations = getAllConversationItems.userConversations;
  let groupConversations = getAllConversationItems.groupConversations;

  //all messages with conversations, max 30 item
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  // console.log(req.user);

  let iceServersList =  await getICETurnServer();
  // console.log(iceServers);
  return res.render("main/home/home",{
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived ,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactReceived: countAllContactReceived,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime,
    iceServersList: JSON.stringify(iceServersList)
  })
}

//get ICE list from xirsys turn server


module.exports = {
  getHome: getHome
}