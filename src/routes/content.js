const express = require("express");
const router = express.Router();
// const middleware = require("../middleware");
const mysql = require("mysql2/promise");
const { mysqlConfig } = require("../config");

router.get("/products", async (req, res) => {
  try {
    const con = await mysql.createConnection(mysqlConfig);
    const [data] = await con.execute(
      `
      SELECT * FROM products;
      `
    );

    con.end();

    res.send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Database error." });
  }
});

module.exports = router;
