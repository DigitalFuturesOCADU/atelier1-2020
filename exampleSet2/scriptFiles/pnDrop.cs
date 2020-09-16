using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using PubNubAPI;




public class pnDrop : MonoBehaviour
{

/*
takes the x Y and instances a prefab there

It is reading from a message structure
{
  x:
  y:
}

*/

  //publish and subscribe keys
  public string pubKey = "pub-c-f4f689cd-7936-4cf0-9cd1-46f8070a6e79";
  public string subKey = "sub-c-5691f306-e64b-11ea-89a6-b2966c0cfe96";

//your UUID
  public string myID = "player4";

//UUID of last publisher
public string lastSender = "";

//these variables will display the value from the message
public int xVal;
public int yVal;

public GameObject clickDrop;
 
// Start is called before the first frame update
public static PubNub dataServer;
public string channelName = "example1";

    void Start()
    {
    PNConfiguration pnConfiguration = new PNConfiguration();
    
    pnConfiguration.SubscribeKey = subKey;
    pnConfiguration.PublishKey = pubKey;
    pnConfiguration.UUID = myID; 

    dataServer = new PubNub(pnConfiguration);


    dataServer.Subscribe ()
      .Channels (new List<string> () { channelName } )
      .Execute();

    dataServer.SubscribeCallback += (sender, e) => 
    
    { 
	SubscribeEventEventArgs inMessage = e as SubscribeEventEventArgs;
    
    if (inMessage.MessageResult != null) 	//error check to insure the message has contents
      {
        //save the UUID of the last sender
        lastSender = inMessage.MessageResult.IssuingClientId;

          //save the message into a Dictionary
          Dictionary<string, object> msg = inMessage.MessageResult.Payload as Dictionary<string, object>;
          
          //retrieve and convert the value you need using the key name 
          /*
          convert to integer -  (int)msg["keyName"]
          convert to float -  (float)msg["keyName"]
          convert to string -  (float)msg["keyName"]

          */
          xVal = (int)msg["x"];
          yVal = (int)msg["y"];
          
          Instantiate(clickDrop, new Vector3(xVal*2, 800, yVal*-2), Quaternion.identity);

      }
    
    };





	}


    

    // Update is called once per frame
    void Update()
    {
        
    }
}
