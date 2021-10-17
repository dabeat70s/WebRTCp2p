var weSocketServ = require('ws').Server;

var wss = new weSocketServ({
    port: 9090
});
var users = {};
wss.on('connection', function(conn){
    console.log("User Connected");
    conn.on('message',function(message){
        var data;

        try {
            data = JSON.parse(message);
        } catch (e) {
            console.log("Invalid JSON");
            data = {};
        }

        switch (data.type) {

            case "login":
                if (users[data.name]) {
                    sendToOtherUser(conn, {
                        type: "login",
                        success: false
                    })
                } else {
                    users[data.name] = conn;
                    conn.name = data.name 

                    sendToOtherUser(conn, {
                        type: "login",
                        success: true
                    })
                }

                break;
        }
    });
    conn.on('close', function (){
        console.log("Connextion closed");
    });
    conn.send("Hello from Da LEJ!");
});

function sendToOtherUser(connection, message) {
    connection.send(JSON.stringify(message))
}