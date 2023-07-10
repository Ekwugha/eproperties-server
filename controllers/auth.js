import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "../client/public/uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueSuffix + fileExtension;
    cb(null, fileName);
    req.body.image = fileName; // Assign the file name to the req.body.image property
  },
});

// Multer upload instance
const upload = multer({ storage });

// // // // // // REGISTER // // // // //
export const register = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res
        .status(500)
        .json({ message: "An error occurred during file upload" });
    }

    if (req.body) {
      const { fname, sname, email, tel, accountType, password } = req.body;

      if (!fname || !sname || !email || !tel || !accountType || !password) {
        return res.status(400).json({ message: "Please enter all the fields" });
      }

      try {
        const checkEmailSql = "SELECT * FROM users WHERE email = ?";
        const existingUser = await new Promise((resolve, reject) => {
          db.query(checkEmailSql, [email], function (error, results) {
            if (error) {
              console.log("Error checking email:", error);
              reject("Error checking email");
            } else {
              resolve(results.length > 0);
            }
          });
        });

        if (existingUser) {
          return res.status(409).json({
            message: "Email already taken. Please use a different email",
          });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const insertSql =
          "INSERT INTO users (fname, sname, email, tel, accountType, password, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [
          fname,
          sname,
          email,
          tel,
          accountType,
          hash,
          req.body.image || null,
        ];

        db.query(insertSql, values, (err, data) => {
          if (err) {
            console.log("Error creating user:", err);
            return res.status(500).json({ message: "Error creating user" });
          }
          return res
            .status(200)
            .json({ message: "Data inserted successfully" });
        });
      } catch (error) {
        console.error("Error:", error);
        res
          .status(500)
          .json({ message: "An error occurred. Please try again." });
      }
    } else {
      console.log("Error:", "System cannot process requests");
      res.status(400).send("Bad Request");
    }
  });
};

// // // // // // LOGIN // // // // //
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, user) => {
    console.log("user:", user[0]);
    if (err) {
      console.log("Error:", err);
      res.status(500).json({ message: "An error occurred. Please try again." });
    } else {
      if (!user[0]) {
        res.status(401).json({ message: "Invalid username" });
      } else {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                id: user[0].id,
                fname: user[0].fname,
                sname: user[0].sname,
                email: user[0].email,
                tel: user[0].tel,
                accountType: user[0].accountType,
                image: user[0].image,
              },
              "jwtPrivateKey"
            );
            res.send(token);
          } else {
            res.status(401).json({ message: "Invalid password" });
          }
        });
      }
    }
  });
};
