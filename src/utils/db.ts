import mongoose from "mongoose";

export const connectDB = async () => {
  try {


    await mongoose.connect(process.env.MONGO_DB_URI || "mongodb+srv://ywubie:VjedQVvZKoa3ELoy@cluster0.yb9ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
