const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multiplart = require("connect-multiparty");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extend: true }));

const corsOptions = {
  origin: "*",
  optionsSucessStatus: 200,
};

app.use(cors(corsOptions));

const multipartMiddleware = multiplart({ uploadDir: "./uploads" });
app.post("/upload", multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});

app.use((err, req, res, next) => res.json({ error: err.message }));

app.listen(8000, () => {
  console.log("Servidor porta 8000");
});
