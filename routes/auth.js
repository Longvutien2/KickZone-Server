import express from "express";
import { signIn, signUp } from "../controllers/users";


const routeUser = express.Router();

routeUser.post('/signup',signUp);
routeUser.post('/signin',signIn);


export default routeUser;