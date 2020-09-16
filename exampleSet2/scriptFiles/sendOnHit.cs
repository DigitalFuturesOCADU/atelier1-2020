using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using PubNubAPI;

[System.Serializable]
public class dataToSend 
{
	public int totalHits;
	public int status;
}


public class sendOnHit : MonoBehaviour
{

/*
This example listens for data and moves the object to the position corresponding 
with the X, Y of the last click.

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
  public string myID = "target1";

//UUID of last publisher
public string lastSender = "";

//these variables will display the value from the message
public int xVal;
public int yVal;

public int currentCount;
 
// Start is called before the first frame update
public static PubNub dataServer;

public string  publishChannel = "scoreboard";
public string  subscribeChannel = "movingTarget";

    void Start()
    {
    PNConfiguration pnConfiguration = new PNConfiguration();
    
    pnConfiguration.SubscribeKey = subKey;
    pnConfiguration.PublishKey = pubKey;
    pnConfiguration.UUID = myID; 

    dataServer = new PubNub(pnConfiguration);


    dataServer.Subscribe ()
      .Channels (new List<string> () { subscribeChannel } )
      .Execute();

    dataServer.SubscribeCallback += (sender, e) => 
    
    { 
	SubscribeEventEventArgs inMessage = e as SubscribeEventEventArgs;
    
    if (inMessage.MessageResult != null) 	//error check to insure the message has contents
      {
        //save the UUID of the last sender
        lastSender = inMessage.MessageResult.IssuingClientId;

        Debug.Log(lastSender);

          //save the message into a Dictionary
          Dictionary<string, object> msg = inMessage.MessageResult.Payload as Dictionary<string, object>;
          
          //retrieve and convert the value you need using the key name 
          /*
          convert to integer -  (int)msg["keyName"]
          convert to float -  (float)msg["keyName"]
          convert to string -  (float)msg["keyName"]

          */

          /*list all keys
         foreach (string key in msg.Keys)
        {
        Debug.Log(key);
        }
        */
         xVal = (int)msg["x"];
          yVal = (int)msg["y"];
          
          transform.position = new Vector3(xVal*2, 0, yVal*-2);

        
      }
    
    };





	}

    void OnTriggerEnter(Collider colSend)
    {
    	currentCount++;

    	dataToSend newMessage = new dataToSend();
    	newMessage.totalHits = currentCount;
		newMessage.status = 1;
    	
		Debug.Log("YOU HIT ME!!");
    	dataServer.Publish()
    	.Channel(publishChannel)
    	.Message(newMessage)
    	.Async((result, status) => 
    	{    
        if (!status.Error) 
        {
            Debug.Log(string.Format("Publish Timetoken: {0}", result.Timetoken));
        } 
	        else 
	        {
	            Debug.Log(status.Error);
	            Debug.Log(status.ErrorData.Info);
	        }
    	});


    }
    

    // Update is called once per frame
    void Update()
    {
        
    }
}
