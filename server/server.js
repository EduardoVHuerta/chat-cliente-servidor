const net = require("net");
const { send } = require("process");

const server = net.createServer();
const serverPort = 3000;

const connections = new Map();

const sendMessage = (message, origin) => {
  for (const socket of connections.keys()) {
    if (socket !== origin) {
      socket.write(message);
    }
  }
};

server.listen(serverPort, () => {
  console.log("Server listening on port: ", server.address().port);

  server.on("connection", (socket) => {
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    socket.setEncoding('utf-8')
    
  
    socket.on("data", (data) => {
      if ( !connections.has(socket)) {
        let isRegistered =false;
        connections.forEach((nickname) => {
          if (nickname == data) {
            socket.write("That name is already being used. \nWhat's your name?: ");
            isRegistered=true;
          }
        });

        if(!isRegistered) {
          connections.set(socket, data);
        console.log(remoteSocket, data, "has joined");
        socket.write('You can now chat with other people!');
        }
  
      }else {
        console.log(`[${connections.get(socket)}]: ${data}`);
  
          const fullMessage = `[${connections.get(socket)}]: ${data}`;
          console.log(`${remoteSocket} -> ${fullMessage}`);
          sendMessage(fullMessage, socket);
        
      }
      
    });
  
    socket.on("error", (err) => {
      console.error(err.message);
      process.exit(1);
    });
  
    socket.on("close", () => {
      console.log(connections.get(socket), "left the chat");
      connections.delete(socket);
    });
  });
  
});
