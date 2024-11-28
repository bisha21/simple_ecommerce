import { createServer } from "http";

const server = createServer((request, response) => {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Hello ram</h1>");

  response.end();
});

server.listen(8000, () => {
  console.log("Server running at port 8000...");
});