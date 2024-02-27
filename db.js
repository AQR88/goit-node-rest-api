import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database conection succesfull"))
  .catch((error) => {
    console.error("Database conection error", error);
    process.exit(1);
  });
