import express from "express";
import { getHomePage } from "../controllers/home.js";

const home = express.Router();

home.get('/', getHomePage);

export default home;

