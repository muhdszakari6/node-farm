const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify")
const replaceTemplate = require("./modules/replaceTemplate");
//Synchronous
// const inputText = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(inputText)
// const textOut = `This is what we know about the avocado: ${inputText}.\n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)

// //Asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/${'append'}.txt`, "utf-8", (err, data3) => {
//         console.log(data3);

//         fs.writeFile(`./txt/final.txt`, `${data2} \n ${data3}`, 'utf-8', (err) => {
//             console.log("File has been written. ");
//           });
//       });
//   });
// });
// console.log("Reading File, Please wait...");

//////SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map(
  (el) => slugify(el.productName, {lower: true})
)

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
 
const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
  }

  //PRODUCT PAGE
  else if (pathname === "/product") {
    const product = dataObj[query.id];
    res.writeHead(200, {
      "Content-type": 'text/html',
    });

    console.log(product)
    const output = replaceTemplate(tempProduct, product)
    res.end(output);
  }

  //API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  
  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found.</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server don start dey listen o at port 8000!");
});





