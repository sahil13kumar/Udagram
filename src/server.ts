import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from "express";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  // app.get("/filteredimage/", async (req: Request, res: Response) => {
  //   let { image_url } = req.query;
  //   var validUrl = require('valid-url');
  //   var delay = require('delay');
  //   if (!image_url) {
  //     return res.status(400)
  //       .send(`image_url is required`);
  //   } else {
  //     if (!validUrl.isUri(image_url)) {
  //       return res.status(400)
  //         .send(`Not a valid URL`);
  //     }
  //   }
  //   var output =  await filterImageFromURL(image_url);
  //   res.sendFile(output);
  //   await delay(3000);
  //   deleteLocalFiles([output]);
  // });
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const url = req.query.image_url;
    //validate the image_url query
    if(!url){
      return res.status(400).send({message: 'Image url is required'})
    }

    // Filter the url and return the filtered image path
    const filteredPath = await filterImageFromURL(url);

    let paths: string[] = [];
    // Transfers the file at the given path
    res.sendFile(filteredPath, (err) => {
      paths.push(filteredPath);
      if(err){
        console.log(err);
      }
      // deletes files on finish of the responsee
      deleteLocalFiles(paths);
    })
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();