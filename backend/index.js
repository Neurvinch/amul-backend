 import express from "express";
 import cors from "cors";
 import mongoose from "mongoose";
 import authRoutes from "./routes/authRoutes.js";
 import userRoutes from "./routes/userRoutes.js";
 import todoRoutes from "./routes/todoRoutes.js";

 const app = express();
 app.use(cors());
 app.use(express.json());

 
 const MONGODB_URI = process.env.MONGODB_URI 
 mongoose
   .connect(MONGODB_URI, { dbName: undefined })
   .then(() => console.log("MongoDB connected"))
   .catch((err) => {
     console.error("MongoDB connection error", err);
     process.exit(1);
   });


app.use(authRoutes);
app.use(userRoutes);
app.use(todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
