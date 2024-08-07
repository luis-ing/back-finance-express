import express from "express";
import { userRouter, AccountWithTransactionsRouter } from "./router/index.js";

const app = express();
const port = 3001;

app.use(express.json())
app.use(userRouter);
app.use(AccountWithTransactionsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});