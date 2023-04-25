import express, { Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/products", (req: Request, res: Response) => {
  const { category, lastId } = req.query;

  const fileName = `${category}.json`;

  fs.readFile(`./data/${fileName}`, "utf-8", (err, data) => {
    if (err) {
      console.log(`erro ao ler arquivo ${fileName}: ${err.message}`);
      res.sendStatus(500);
      return;
    }

    const jsonData = JSON.parse(data);
    const { products } = jsonData;
    let startIndex = 0;

    if (lastId) {
      const lastProductIndex = products.findIndex(
        (product) => product.id === lastId
      );
      startIndex = lastProductIndex + 10;
    }

    const paginatedProducts = products.slice(startIndex, startIndex + 10);

    res.json({ products: paginatedProducts });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
