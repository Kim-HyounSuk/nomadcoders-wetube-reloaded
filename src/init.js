import "dotenv/config";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import App from "./server.js";

const PORT = 4000;

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT} ✅`);

App.listen(PORT, handleListening);
