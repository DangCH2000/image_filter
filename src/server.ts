import express from "express";
import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app = express();

  const port = process.env.PORT || 8088;

  app.use(bodyParser.json());
  // add filter image
  app.get("/image_filtered", async (req: Request, res: Response) => {
    const image_url = req.query.image_url.toString();
    if (!image_url) {
      res.status(400).send("URL is required");
    }

    const filtered_image = await filterImageFromURL(image_url);
    res.status(200).sendFile(filtered_image, () => {
      deleteLocalFiles([filtered_image]);
    });
  });

  app.get("/", async (req, res) => {
    res.send("try GET /image_filtered?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`);
    console.log(`Press CTRL+C to stop server`);
  });
})();
