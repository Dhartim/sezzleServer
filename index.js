const webSocketServer = require('websocket').server;
const http = require('http');

//create http server
const server = http.createServer();
server.listen(process.env.PORT || 5000)
console.log("listening on port ....");

const webSocket = new webSocketServer({
    httpServer : server
});

const clients = {}; 

//get unique userID for each user
const getUniqueUserID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4()+s4()+'-'+s4();
};

webSocket.on('request', function(request){
    var userID = getUniqueUserID();
    console.log((new Date())+ ' Received a new connection from origin ' + request.origin + ".");
    //accept the request
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected ' + userID + 'in' + Object.getOwnPropertyNames(clients));
    connection.on('message', function(message){
        if(message.type === 'utf8')
        {
            console.log('Received msg: ' + message.utf8Data);
            //broadcast message to all
            for(key in clients)
            {
                clients[key].sendUTF(message.utf8Data);
                console.log("send message to " + clients[key]);
            }
        }
    })
});

