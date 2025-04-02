import express from "express";
import { getListUser, signIn, signUp, updateUser } from "../controllers/users";


const routeUser = express.Router();

routeUser.post('/signup', signUp);
routeUser.post('/signin', signIn);

routeUser.get('/user', getListUser);
routeUser.patch('/user/:id', updateUser);


export default routeUser;