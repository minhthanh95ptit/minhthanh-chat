import {notifcation, contact, message} from "./../services/index"

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

  console.log(userConversations);

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
    allConversations: allConversations,
    userConversations: userConversations,
    groupConversations: groupConversations
  })
}

module.exports = {
  getHome: getHome
}