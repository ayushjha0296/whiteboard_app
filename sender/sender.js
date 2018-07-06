function onConnect()
{
  console.log("connected");
}
function onFailure()
{
  console.log("try it again");
}
var mqtt;
var host = "192.168.35.144";
var port = 61614;
var count = 1;
mqtt = new Paho.MQTT.Client(host , port , "clientjs");
var options = {
  timeout : 3,
  onSuccess : onConnect,
  onFailure : onFailure
};
mqtt.connect(options);
var canvas = new fabric.Canvas("mycanvas");
var plots = [];
function makeRect()
{
  var rect= new fabric.Rect({
    left : plots[0].x,
    top : plots[0].y,
    width :Math.abs(plots[1].x - plots[0].x),
    height :Math.abs(plots[1].y - plots[0].y)
  });
  canvas.add(rect);
  plots = [];
}
function onConnectionLost(responseObject) {
if (responseObject.errorCode !== 0) {
  console.log("onConnectionLost:"+responseObject.errorMessage);
}
}
function clearit()
{
  canvas.clear();
  sendmessage();
}
function sendmessage()
{
  message = new Paho.MQTT.Message(JSON.stringify(canvas));
  console.log(JSON.stringify(canvas));
  var text = JSON.stringify(canvas);
  document.getElementById("demo").innerHTML = text;
  message.destinationName = "sensor1";
  message.qos = 2;
  mqtt.send(message);
}
mqtt.onConnectionLost = onConnectionLost;
function eventSensor(options,e)
{
  var whichIsSelected = document.getElementById("chooseIt").value;
  if(whichIsSelected == "pencil")
  {
    canvas.isDrawingMode = true;
  }
  else if (whichIsSelected == "rectangle")
  {
    canvas.isDrawingMode = false;
    var x = options.e.clientX;
    var y = options.e.clientY;
    plots.push({x : x , y : y});
  }
}
function eventSensor1(options , e)
{
  var whichIsSelected = document.getElementById("chooseIt").value;
  if(whichIsSelected == "pencil")
  {
    var i;
    if(count==2){
    for(i=0;i<2;i++)
    {
    sendmessage();}}
    else {
      sendmessage();
      count++;
    }
  }
  else if(whichIsSelected == "rectangle")
  {
    var x = options.e.clientX;
    var y = options.e.clientY;
    plots.push({x : x , y : y});
    makeRect();
    sendmessage();
  }
}
canvas.on('mouse:down',eventSensor);
canvas.on('mouse:up',eventSensor1);
