import express, { Request, Response } from "express";
import cors from "cors";
import * as fs from "fs";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/:category", (req: Request, res: Response) => {
  const { category } = req.params;
  const { lastId } = req.query;

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

app.listen(3333, () => {
  console.log("servidor rodando na rota 3333");
});
