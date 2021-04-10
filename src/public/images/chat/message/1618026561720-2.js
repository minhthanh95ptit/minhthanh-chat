
var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
for(var i = 0; i < 2000; i++){
  randomNumber = Math.floor(Math.random() * 24);
  // console.log(randomNumber)
  a[randomNumber]++
}
console.log(a)

