import {validationResult} from "express-validator/check"
import {message} from "./../services/index"
import multer from "multer"
import {app} from "./../config/app"
import fsExtra from "fs-extra"
import { transErrors, transSuccess } from "./../../lang/vi";

let addNewTextEmoji = (async (req, res) =>{
  // console.log("Controller");
  let errorArr = []
  let validationErrors = validationResult(req)
  
  if (!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped())
   

    errors.forEach(item =>{
      errorArr.push(item.msg)
    })
    
    return res.status(500).send(errorArr)
  }

  // console.log(req.user);

  try{
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    };

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    // console.log(receiverId);
    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    // console.log(typeof newMessage)

    // console.log(newMessage);
    return res.status(200).send({message: newMessage})

  }
  catch(error){
    return res.status(500).send(error);
  }

});

let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) =>{
    callback(null, app.image_message_directory)
  },
  filename: (req, file, callback) =>{
    let match = app.image_type;

    if(match.indexOf(file.mimetype) === -1){
      return callback(transErrors.image_type_error, null);
    }

    let imageName = `${Date.now()}-${file.originalname}`;
    callback(null, imageName)
  }
})

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {fileSize: app.image_limit_size}
}).single("my-image-chat")

let addNewImage = (req, res) =>{
 
  imageMessageUploadFile(req, res, async (error) => {
    if(error){
      if(error.message){
        return res.status(500).send(transErrors.image_size_error)
      }
      return res.status(500).send(error)
    }

    try{
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
  
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      console.log(receiverId);
      console.log(messageVal);
      console.log(isChatGroup);
      
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
  
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)
      // console.log(newMessage)
      // Remove image, because this image is saved to mongodb
      return res.status(200).send({message: newMessage})
  
    }
    catch(error){
      return res.status(500).send(error);
    }

  })
};

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage
}