import express from "express";
// import session from "express-session";
import cors from "cors";
import "./db.js";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// // // // // // ... // // // // //
app.use("/api/auth", authRoutes);

app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
