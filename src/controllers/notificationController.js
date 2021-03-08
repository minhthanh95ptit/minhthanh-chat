import {notifcation} from "./../services/index"



let readMore = async (req, res) =>{
  try {
    // get skip number from quert param
    let skipNumberNotif = +(req.query.skipNumber); // + -> Tu dong chuyen thanh Number
    console.log(skipNumberNotif)
    // get more item
    let newNotifications = await notifcation.readMore(req.user._id, skipNumberNotif)
    
    return res.status(200).send(newNotifications)

  } catch (error) {
    return res.status(500).send(error)
  }
};

module.exports ={
  readMore: readMore
}