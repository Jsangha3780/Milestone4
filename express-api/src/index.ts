import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import registrationRoutes from "./routes/registrationRoutes";
import collegeRoutes from "./routes/collegeroute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/registrations", registrationRoutes);
app.use("/colleges", collegeRoutes);

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});