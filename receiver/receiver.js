var canvas = new fabric.Canvas("mycanvas");
function onMessageArrived(message)
{
  console.log(message.payloadString);
  canvas.loadFromJSON(message.payloadString);
}
function onConnect()
{
  console.log("connected");
  mqtt.subscribe("sensor1");
}
function onFailure()
{
  console.log("connection failed");
}
var mqtt;
var host = "localhost";
var port = 61614;
mqtt = new Paho.MQTT.Client(host,port,"client1");
var options = {
  timeout : 3,
  onSuccess : onConnect,
  onFailure : onFailure,
  cleanSession : false,
};
mqtt.connect(options);
mqtt.onMessageArrived = onMessageArrived;
