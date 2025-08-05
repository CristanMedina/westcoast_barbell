import express from "express";
import sequelize from "./db/connection.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import "./models/trainer.model.js";
import "./models/company.model.js";
import "./models/payment.model.js";
import "./models/user.model.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/trainers", trainerRoutes);
app.use("/users", userRoutes);
app.use("/company", companyRoutes);
app.use("/payments", paymentRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced with alter: true");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
