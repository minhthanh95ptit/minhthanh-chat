import notifcation from "./../services/notificationService"

let getHome = async (req, res) =>{
  let notifications = await notifcation.getNotification(req.user._id)

  return res.render("main/home/home",{
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications
  })
}

module.exports = {
  getHome: getHome
}