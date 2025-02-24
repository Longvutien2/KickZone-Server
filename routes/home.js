// const express = require('express');
import express from "express";
const home  = express.Router();

home.get('/', (request, response) => {
    response.send(`
        <h1>Trang chủ</h1>
        <p>Content trang chủ <p/>
        <img src="https://picsum.photos/2000/400">
    `)
})

// module.exports = route;
export default home;

