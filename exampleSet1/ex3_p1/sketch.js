/*

keyboard controller
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-f4f689cd-7936-4cf0-9cd1-46f8070a6e79';
let subKey = 'sub-c-5691f306-e64b-11ea-89a6-b2966c0cfe96';

///////////////////////////////////////////////////////




///This is my username for the server
let myID = "player1";

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "example3";




//This object is going to be used to handle the data we send to the server
let dataToSend = 
{
theKeyPressed:''
}

let lastKeyPressed = '';



function setup() 
{
  
  createCanvas(600,400);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true,  //enables a secure connection. 
    uuid: myID
  });
  


}

function draw() 
{
  background(0);
  noStroke();
  textSize(24);  
  fill(255);
  textAlign(CENTER,CENTER);
  text("Use WASD keys to move",width/2,height/2);
  
  textSize(12);
  text("click on the canvas before pressing keys",width/2,height/2+20);
  
  
  textSize(130);
  text(lastKeyPressed,width/2,height/2+100)

   

}


///uses built in mouseClicked function to send the data to the pubnub server
function keyPressed() 
{
console.log(key);  
 //assign the key value to the dataToSend object 
 dataToSend.theKeyPressed=key;
  
//also assign it to the variable to draw it on screen  
lastKeyPressed = key;

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: dataToSend
    });

}


