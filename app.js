const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const path = require("path");

// Middleware to parse JSON data in requested body

app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Filepath where we read and write the JSON data

const filePath = "data.json";

app.get("/", (req, res) => {
  res.send('Hello Techmonstro');
});

app.post("/api/sendinfo", (req, res) => {
  const userInfo = req.body;
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("An Error occured while reading file ");
      return res
        .status(500)
        .json({ error: "An Error occured while reading file" });
    }
    let jsonData = JSON.parse(data);
    if (!Array.isArray(jsonData)) {
      jsonData = [];
    }
    jsonData.push(userInfo);
    const userInfoUpdate = JSON.stringify(jsonData, null, 2);
    console.log("UpdatedFile", userInfoUpdate);

    //Write new user to the userData
    fs.writeFile(filePath, userInfoUpdate, "utf8", (err) => {
      if (err) {
        console.error("Cannot add new user");
        return res
          .status(500)
          .json({ error: "An Error occured while reading file" });
      } else {
        console.log("Data has been written to the file successfully");
        res.json({ message: "Data has been written to the file successfully" });
      }
    });
  });
});

//Define API route to fetch all user information data
app.get("/api/info", (req, res) => {
  // Read data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file");

      return res.status(500).json({ error: "Error reading from the file" });
    } else {
      let jsonData = JSON.parse(data);

      if (!Array.isArray(jsonData)) {
        jsonData = [];
      }

      res.json(jsonData);
    }
  });
});

app.get("/allusers", (req, res) => {
  console.log("these are all the users");
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "public", "allusers.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});