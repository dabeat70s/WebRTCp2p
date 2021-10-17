var connection = new WebSocket('ws://localhost:9090');

connection.onopen = function () {
    console.log("Connected to the server");
};

connection.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    console.log("Message from server",data);
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
                    name: name1
                })
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
    connection.send(JSON.stringify(message))
}

function loginProcess(success) {
    if (success === false) {
        alert("Username used, try an alternative!");
    } else {
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then((myStream)=>{
             stream1 = myStream;
            local_video.srcObject = stream1;
        }).catch((error)=> {
            console.log("error: ", error)
        });

    }
}


