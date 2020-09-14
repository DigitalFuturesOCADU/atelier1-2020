/*

send mouse clicks
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-f4f689cd-7936-4cf0-9cd1-46f8070a6e79';
let subKey = 'sub-c-5691f306-e64b-11ea-89a6-b2966c0cfe96';

///////////////////////////////////////////////////////




///This is my username for the server
let myID = "player2";

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "example2";


let player1Image;
let player2Image;




//This object is going to be used to handle the data we send to the server
let dataToSend = 
{
x:0,
y:0
}
//This object is going to hold all the messages as they come in.
let dataReceived = [];



function preload()
{
//for this to work you must match up the folder + image name locally
//if you have several images you can load them all into an array
//You have made a mistake if you only see the Loading..... message  
  
player1Image = loadImage("images/tile2.jpg");
player2Image = loadImage("images/tile4.jpg");  
  
}




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
  
  //subscribe to data channels
  dataServer.subscribe({channels: [channelName]});

  //add a listener to trigger a specific function when a message is received
  dataServer.addListener({ message: readIncoming});

//I turn down the framerate so it doesn't flash so quickly in the draw
frameRate(10);

}

function draw() 
{
  background(255);
  noStroke();
  textSize(24);  
  fill(0);
  textAlign(CENTER,CENTER);
  text("Hello, my name is "+myID,width/2,(height/2)-12);

 

  for(let i=0;i<dataReceived.length;i++)
  {
    imageMode(CENTER,CENTER);
    
    ///a switch is a more condense way of writing a lot of if statements: 
    switch(dataReceived[i].publisher)
    {
      case "player1":
      //https://p5js.org/reference/#/p5/image  
      image(player1Image, dataReceived[i].message.x, dataReceived[i].message.y, 50,50);
      break;
      
      case "player2":
      image(player2Image, dataReceived[i].message.x, dataReceived[i].message.y, 50, 50);
      break;      
        
        
        
    }
    
    
  }
  

}


///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() 
{
  
 //assign the mouseX mouseY values to the dataToSend object 
 dataToSend.x=mouseX;
 dataToSend.y=mouseY;

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: dataToSend
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
                                //I called the variable inMessage, but it could be any name
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    console.log(inMessage);
   //https://www.w3schools.com/jsref/jsref_push.asp
    dataReceived.push(inMessage);
    
    console.log(dataReceived);
    

  }
}
