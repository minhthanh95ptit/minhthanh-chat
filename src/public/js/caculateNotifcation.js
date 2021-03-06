function increaseNumberNotification(className){
  let currentValue = +$(`.${className}`).text();
  currentValue += 1;

  if(currentValue === 0){
    $(`.${className}`).css("display","none").html("")
  } 
  else{
    $(`.${className}`).css("display","block").html(currentValue)
  }
  // console.log("Tang")
  // console.log(currentValue)
  // console.log(typeof currentValue)
}

function decreaseNumberNotification(className){
  let currentValue = +$(`.${className}`).text();

  currentValue -= 1;

  if(currentValue === 0){
    $(`.${className}`).css("display","none").html("")
  } 
  else{
    $(`.${className}`).css("display","block").html(currentValue)
  }
  console.log(currentValue)
  console.log(typeof currentValue)
}
