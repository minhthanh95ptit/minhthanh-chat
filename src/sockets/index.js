import addNewContact from "./contact/addNewContact"
import removeRequestContactSent from "./contact/removeRequestContactSent"
import removeRequestContactReceived from "./contact/removeRequestContactSent"
import approveRequestContactReceived from "./contact/approveRequestContactReceived"

let initSockets = (io) =>{
  addNewContact(io);
  removeRequestContactSent(io);
  removeRequestContactReceived(io);
  approveRequestContactReceived(io);
  //
}

module.exports = initSockets;