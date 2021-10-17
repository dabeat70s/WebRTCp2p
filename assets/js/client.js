var connection = new WebSocket("ws://localhost:9090");

connection.onopen = function () {
  console.log("Connected to the server");
};

connection.onmessage = function (msg) {
  var data = JSON.parse(msg.data);
  console.log("on Message itself", msg);
  switch (data.type) {
    case "login":
      loginProcess(data.success);
      break;
  }
};

connection.onerror = function (error) {
  console.log("Error on server", error);
};

var local_video = document.querySelector("#local-video");

var name1;
var connectedUser;
var myConn;
var dataChannel;
var activeStream;
var url_string = window.location.href;
var url = new URL(url_string);
var username = url.searchParams.get("username");

setTimeout(() => {
  if (connection.readyState === 1) {
    if (username != null) {
      name1 = username;
      if (name1.length > 0) {
        send({
          type: "login",
          name: name1,
        });
      }
    }
  } else {
    console.log("Connection has not estublished ok!");
  }
}, 3000);

function send(message) {
  if (connectedUser) {
    message.name = connectedUser;
  }
  connection.send(JSON.stringify(message));
}

function loginProcess(success) {
  if (success === false) {
    alert("Username used, try an alternative!");
  } else {
    var enumDevices = navigator.mediaDevices.enumerateDevices();
    var deviceArr = [];
    enumDevices.then((devices) =>
      devices.forEach((device) => {
        deviceArr.push(device.kind);        
      })
    );
    setTimeout(() => {     
      var objConstraints = {};       
      checkDevArr = deviceArr;

      var ifVideo = checkDevArr.some((val) => val == "videoinput");
      var ifAudio = checkDevArr.some((val) => val == "audioinput");          

      if (checkDevArr.some((val) => val == "videoinput")) {
        objConstraints.video = true;       
      }

      if (ifAudio ) {
        objConstraints.audio = true;        
      }    

      var chekRest = checkDevArr.some((val) => val == "videoinput");
      navigator.mediaDevices
        .getUserMedia(objConstraints)
        .then((myStream) => {
            activeStream = myStream;
          stream1 = myStream;
          local_video.srcObject = stream1;
        })
        .catch((error) => {
          console.log("error: ", error);
        });
    }, 1000);
  }
}
