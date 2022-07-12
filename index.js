import express, { json } from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = { origin: process.env.URL || '*' };

app.use(cors(corsOptions));
app.use(json());

//ROUTES
app.get('/', async(req, res)=>{
    console.log('Hello');
});
// create a table
app.post("/products", async(req, res)=>{
    try {
      // console.log(req.body);
      const{name, description, price, stars, location, created_at, updated_at, type_id} = req.body;
      const newProduct = await pool.query("INSERT INTO product (name, description, price, stars, location, created_at, updated_at, type_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [name, description, price, stars, location, created_at, updated_at, type_id]);
      res.json(newProduct.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  //get all products
  app.get('/products', async(req, res) => {
    try {
      const allprods = await pool.query("SELECT * FROM product");
      res.json(allprods.rows);
    } catch (error) {
      console.log(error.message);
    }
  });
  
  //get a single product
  app.get('/products/:id', async(req, res)=> {
    const { id } = req.params;
    try {
      const prod = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]);
      res.json(prod.rows[0]);
    } catch (error) {
      console.log(error.message);
    }
  });
  
  //update a product
  app.put("/products/:id", async(req, res)=>{
    try {
      const { id } = req.params;
      const {description} = req.body;
      
      const updateProd = await pool.query("UPDATE product SET description = $1 WHERE product_id = $2", [description, id]);
      res.json("Product Updated");
      
    } catch (error) {
      console.log(error.message);
    }
  });
  
  // Delete a product
  app.delete("/products/:id", async(req, res)=>{
    try {
      const {id} = req.params;
      const deleteProd = await pool.query("DELETE FROM product WHERE product_id = $1",[id]);
      res.json("Product Deleted");
      
    } catch (error) {
      console.log(error.message);
      
    }
  })


app.listen(PORT, () => {
    console.log(`Server is listening on: ${PORT}`);
})