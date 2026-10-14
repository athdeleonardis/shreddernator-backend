import express from "express";

import router from "./routing/routing.js";

const app = express();

app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000")
});
