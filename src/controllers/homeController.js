import notifcation from "./../services/notificationService"

let getHome = async (req, res) =>{
  //Only 10 items one time
  let notifications = await notifcation.getNotification(req.user._id)
  // Get Amount notifications unread
  let countNotifUnread = await notifcation.countNotifUnread(req.user._id)

  return res.render("main/home/home",{
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread
  })
}

module.exports = {
  getHome: getHome
}