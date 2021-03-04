function increaseNumberNotisContact(className){
  let currentValue = +$(`.${className}`).find("em").text();
  currentValue += 1;

  if(currentValue === 0){
    $(`.${className}`).html("")
  } 
  else{
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
  console.log(currentValue)
  console.log(typeof currentValue)
}

function decreaseNumberNotisContact(className){
  let currentValue = +$(`.${className}`).find("em").text();
  currentValue -= 1;

  if(currentValue === 0){
    $(`.${className}`).html("")
  } 
  else{
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
  console.log(currentValue)
  console.log(typeof currentValue)
}
