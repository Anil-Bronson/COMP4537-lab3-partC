const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    const q = url.parse(req.url, true).query;
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.path);
    const filename = "file.txt";
    const text = q.text || "Error reading text";

    if(parsedUrl.pathname.startsWith("/writeFile")){
        fs.access(filename, fs.constants.F_OK, (err) => {
            if (err){
                fs.writeFile(filename, text, (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/html" });
                        res.end("Error: " + err.toString());
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end("<p>Successfully created file and added text!</p>");
                    }
                });
                res.end();
            } else {
                fs.appendFile(filename, "\n" + text, (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/html" });
                        res.end("Error: " + err.toString());
                    } else {
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end("<p>Successfully appended text!</p>");
                    }
                });
            }
        });
    }
    else if(parsedUrl.pathname.startsWith("/readFile")){
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {"Content-Type" : 'text-html'});
            } else {
                res.writeHead(200, { "Content-Type": "text-html" });
                res.end(`<p>${data}</p>`)
            }
        })
    }

    
}).listen(PORT);

