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
let myID = "player1";

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "example2";




//This object is going to be used to handle the data we send to the server
let dataToSend = 
{
x:0,
y:0
}
//This object is going to hold all the messages as they come in.
let dataReceived = [];



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
  background(0);
  noStroke();
  textSize(24);  
  fill(255);
  textAlign(LEFT,CENTER);
  text("Hello, my name is "+myID,0,height-12);

 

  for(let i=0;i<dataReceived.length;i++)
  {
  let r = random(255); // r is a random number between 0 - 255
  let g = random(100,200); // g is a random number betwen 100 - 200
  let b = random(100); // b is a random number between 0 - 100
  let a = random(200,255); // a is a random number between 200 - 255
  
  let dotRadius = random(10,300);
  noStroke();
  fill(r, g, b, a);
  
  //draw an ellipse of random size and color  
  ellipse(dataReceived[i].message.x,dataReceived[i].message.y,dotRadius,dotRadius);

    
    
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
