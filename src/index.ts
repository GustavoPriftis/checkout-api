import express from "express";
import bodyParser from "body-parser";
import checkoutRouter from "./routes/checkout";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", checkoutRouter);

app.listen(port, () => {
  console.log(`Checkout API listening on port ${port}`);
});
