import "dotenv/config";

import connectDB from "./src/config/db.js";
import app from "./src/app.js";

async function startServer() {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`DevBlog API running on http://localhost:${port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use by another process. Please stop the process running on port ${port} or change PORT in .env.`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("Server could not start because database initialization failed:", error.message);
    process.exit(1);
  }
}

startServer();