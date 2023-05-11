import mongoose from "mongoose";

// wetube라는 mongodb database로 연결
mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB ✅");
const handleErr = (err) => console.log("DB Error ❌", err);

db.on("error", handleErr);
db.once("open", handleOpen);
