const express = require("express"),
      app = express();

app.get("/", (req.res) => {
    res.send("Landing Page");
})

app.listen(3000, () => {
    console.log("connected..");
})