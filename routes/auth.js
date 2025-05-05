import express from "express";
import { changePassword, getListUser, signIn, signUp, updateUser } from "../controllers/users";


const routeUser = express.Router();

routeUser.post('/signup', signUp);
routeUser.post('/signin', signIn);

routeUser.get('/user', getListUser);
routeUser.patch('/user/:id', updateUser);
routeUser.patch('/user/changepass/:id', changePassword);


export default routeUser;