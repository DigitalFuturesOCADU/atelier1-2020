/*
Shared Canvas - receives data from each controller and moves the shape
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-f4f689cd-7936-4cf0-9cd1-46f8070a6e79';
let subKey = 'sub-c-5691f306-e64b-11ea-89a6-b2966c0cfe96';

///////////////////////////////////////////////////////




///This is my username for the server
let myID = "shared";

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "example3";



//these object are used to manage the data coming in from the controllers
let player1Position =
{
x:200,
y:200
};

let player2Position =
{
x:400,
y:200
};

//this is the amount in pixels the object will move after receiving each message
let moveAmount = 10;

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

}

function draw() 
{
  background(0);
  noStroke();
  
  //this is the player 1 object
  fill(255,0,0);
  ellipse(player1Position.x,player1Position.y,20,20);
  
  //this is the player 2 object
  fill(0,255,0);
  rectMode(RADIUS);
  rect(player2Position.x,player2Position.y,20,20);
  
  
  stroke(255);
  strokeWeight(4);
  line(player1Position.x,player1Position.y,player2Position.x,player2Position.y);

   

}

function readIncoming(inMessage)
{
  //console.log(inMessage);
  
  
  //filter1 who sent it?
  if(inMessage.publisher=="player1")
  {
    //filter2 what key did they press???
    //https://www.w3schools.com/js/js_switch.asp
    switch(inMessage.message.theKeyPressed)
    {
      case 'w':
        player1Position.y -= moveAmount;
        //move up
        break;
      case 'a':
        player1Position.x -= moveAmount;
        //move left
        break;        
      case 's':
        player1Position.y += moveAmount;
        //move down
        break;
      case 'd':
        player1Position.x += moveAmount;
        //move right
        break;        
        
    }
    
    
  }
  //filter1 who sent it?
  if(inMessage.publisher=="player2")
  {
    //filter2 what key did they press???
    //https://www.w3schools.com/js/js_switch.asp
    switch(inMessage.message.theKeyPressed)
    {
      case 'w':
        player2Position.y -= moveAmount;
        //move up
        break;
      case 'a':
        player2Position.x -= moveAmount;
        //move left
        break;        
      case 's':
        player2Position.y += moveAmount;
        //move down
        break;
      case 'd':
        player2Position.x += moveAmount;
        //move right
        break;        
        
    }
    
    
  }
  
  
  
  
}



