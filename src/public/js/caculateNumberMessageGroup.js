function increaseNumberMessageGroup(divId){
  //Dau + convert string to number
  let currentValue = +$(`.right[data-chat=${divId}]`).find("span.show-number-messages").text();
  currentValue += 1;

  $(`.right[data-chat=${divId}]`).find("span.show-number-messages").html(currentValue);
}

