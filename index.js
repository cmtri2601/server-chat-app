require("dotenv").config();
const express = require("express");
const server = require("./src/server");

const app = express();
app.use(express.json());

app.use("/api/v1", server);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
