import {contact} from "./../services/index"
import {validationResult} from "express-validator/check"

let findUsersContact = async (req, res) =>{
  let errorArr = []

  let validationErrors = validationResult(req)
  if (!validationErrors.isEmpty()){
    let errors = Object.values(validationErrors.mapped())

    errors.forEach(item =>{
      errorArr.push(item.msg)
    })
    // Logging
    // console.log(errorArr)
    return res.status(500).send(errorArr)
  }

  try {
    let currentUserId = req.user._id
    let keyword = req.params.keyword
    
    // console.log(currentUserId, keyword)

    console.log(typeof currentUserId);
    let users = await contact.findUsersContact(currentUserId, keyword)

    // console.log(users)
    return res.render("main/contact/sections/_findUsersContact",{users})
    // console.log(users)

  } catch (error) {
    return res.status(500).send(error)
  }
}

let addNew = async (req, res) =>{
  try {
    let currentUserId = req.user._id
    let contactId = req.body.uid 

    let newContact = await contact.addNew(currentUserId, contactId)
    // console.log(newContact)
    // console.log(!!newContact)
    return res.status(200).send({success: !!newContact});
  } catch (error) {
    return res.status(500).send(error)
  }
}

let removeRequestContact = async (req, res) =>{
  try {
    let currentUserId = req.user._id
    let contactId = req.body.uid 

    let removeReq = await contact.removeRequestContact(currentUserId, contactId)
    // console.log(removeReq)
    // console.log(!!removeReq)
    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact
}
