import {notifcation, contact} from "./../services/index"

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

  return res.render("main/home/home",{
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    contactsSent: contactsSent,
    contactsReceived: contactsReceived 
  })
}

module.exports = {
  getHome: getHome
}