import moment from "moment";

export let bufferToBase64 = (bufferFrom) =>{
  return Buffer.from(bufferFrom).toString("base64");
};

export let lastItemOfArray = (array) =>{
  //Chua co tin nhan nao ca
  if(!array.length) {
    return [];
  }
  //Lay index cuoi cung cua mang
  return array[array.length - 1];
};

export let convertTimestampToHumanTime = (timestamp) =>{
  if(!timestamp){
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}