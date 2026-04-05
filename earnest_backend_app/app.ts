import express from 'express';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import cors from  "cors"
import fileupload from "express-fileupload";
import { allRoutes } from './src/module/routes';

//initialize express app
var app = express();

app.use(fileupload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(
  {
    origin : "http://localhost:3000",
    credentials : true
  }
));

// user all routes for All module
app.use('/', allRoutes);

const Port = process.env.PORT;
//server listening on port number = 4000
app.listen(Port, ()=>{
  console.log(`Server listening on port : ${Port}`)
})

export default app;
