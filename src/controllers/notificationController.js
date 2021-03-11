import {notifcation} from "./../services/index"



let readMore = async (req, res) =>{
  try {
    // get skip number from quert param
    let skipNumberNotif = +(req.query.skipNumber); // + -> Tu dong chuyen thanh Number
    // console.log(skipNumberNotif)
    // get more item
    let newNotifications = await notifcation.readMore(req.user._id, skipNumberNotif)
    
    return res.status(200).send(newNotifications)

  } catch (error) {
    return res.status(500).send(error)
  }
};

let markAllAsRead = async (req, res) =>{
  try {
    let mark = await notifcation.markAllAsRead(req.user._id, req.body.targetUsers)
    return res.status(200).send(mark)
  } catch (error) {
    return res.status(500).send(error)
  }
};

module.exports ={
  readMore: readMore,
  markAllAsRead: markAllAsRead
}