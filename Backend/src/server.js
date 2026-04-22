const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDatabase = require("./config/db");

const port = Number(process.env.PORT) || 8080;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Try & Buy API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
