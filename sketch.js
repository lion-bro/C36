
var dog, dogIMG, happyDog, happyDogIMG,sadDog,sadDogIMG;
var database;
var foodS, foodStock;
var count;
var feed,addFood;
var fedTime, lastFed, currentTime;
var foodObj;
var changeState, readState;
var bedroom, garden, washroom, bedroomIMG, gardenIMG, washroomIMG;

function preload()
{
  dogIMG = loadImage("images/dog.png"); 
  happyDogIMG = loadImage("images/happydog.png"); 
 
  bedroomIMG = loadImage("virtualpetimages/BedRoom.png"); 
  gardenIMG = loadImage("virtualpetimages/Garden.png"); 
  washroomIMG = loadImage("virtualpetimages/WashRoom.png"); 
} 
 
function setup() { 
  createCanvas(500, 500); 
  database = firebase.database(); 
  dog = createSprite(250,250,50,50); 
  dog.scale = 0.2;
  dog.addImage(dogIMG);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();

  readState = database.ref("gameState");
  readState.on("value",function(data){
    gameState = data.val();
  });

//count = 20;

  feed = createButton("Feed the dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);
  
}


function draw() {  

  //background(46,139,87);

  foodObj.display();

  drawSprites();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
  lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed%12 + "PM", 350,30);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM",350,30);
  }
  else{
    text("Last Feed : "+ lastFed + "AM",350,30);
  }


  if(readState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogIMG);
  }

 currentTime = hour();

 if(currentTime === (lastFed+1)){
   update("Playing");
   console.log("playing");
   foodObj.garden();
 }
 else if(currentTime === (lastFed + 2)){
   update("Sleeping");
   foodObj.bedroom();
   console.log("sleeping");
 }
 else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
  update("Bathing");
  foodObj.washroom();
  console.log("bathing");
 }
 else{
   update("Hungry");
   foodObj.display();
   console.log("hungry");
 }
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function feedDog(){

  dog.addImage(happyDogIMG);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function readStock(data)
{
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function writeStock(x)
{
  database.ref('/').update({
    Food:x
  })
}