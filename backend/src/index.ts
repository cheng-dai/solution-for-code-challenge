import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/funding-rounds", async (req: Request, res: Response) => {
  const fundingRounds = await prisma.fundingRound.findMany({
    take: 20,
  });
  res.json(
    fundingRounds.map(({ name, amount }) => ({ name, amount: Number(amount) })),
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
