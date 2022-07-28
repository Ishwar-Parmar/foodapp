import express, { json } from 'express';
import cors from 'cors';
import pool from './db.js';
import multer from 'multer';
// const paypal = require('paypal-rest-sdk');
import paypal from 'paypal-rest-sdk';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv';

//Payment
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AbeH9Cmf68Cr6EGTUzpV6bUJr5VbS6O_f6B8GDXHglms1x2OYwiYxDQ4FcSxozoneWdQ502DnbiFoxKq',
  'client_secret': 'EDrI7M7cPN8lIB9rjrEUV35AmaEVAmOyk_4nXfmf0ODuD9AnuTtCsbaNebsCiv31zZb8GsAiggKXBJqy'
});


const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = { origin: process.env.URL || '*' };

//image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(cors(corsOptions));
app.use('/uploads/', express.static('uploads'));
// app.use("/api", require("./routes/app.routes"))
app.use(json());

//ROUTES
app.get('/', async (req, res) => {
  res.send("Food Apis");
});

//Paypal Integration
app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "https://ifoodapp-db.herokuapp.com/success",
      "cancel_url": "https://ifoodapp-db.herokuapp.com/cancel"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": "Red Sox Hat",
          "sku": "001",
          "price": "5.00",
          "currency": "USD",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "USD",
        "total": "5.00"
      },
      "description": "Hat for the best team ever"
    }]
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log(payment);
      // res.send('test');
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

//get req
app.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "5.00"
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));
      res.send('Success');
    }
  });
});

// cancel
app.get('/cancel', (req, res) => res.send('Cancelled'));


// create product table
app.post("/products", upload.single('productImage'), async (req, res) => {
  console.log(req.file);
  try {
    const { name, description, price, stars, location, created_at, updated_at, type_id } = req.body;
    const img = req.file.path;
    const newProduct = await pool.query("INSERT INTO product (name, description, price, stars, img, location, created_at, updated_at, type_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [name, description, price, stars, img, location, created_at, updated_at, type_id]);
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
// create user table
app.post("/register", async (req, res) => {
  try {
    const { f_name, phone, email, password } = req.body;
    // const encryptedPassword=await bcrypt.hash(password,10);
    const user = await pool.query("INSERT INTO register (f_name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [f_name, phone, email, password]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//Registration
// app.post("/register", async (req, res) => {
//   try {
//     const { f_name, phone, email, password } = req.body;
//     if (!(email && password && f_name && phone)) {
//       res.status(400).send("All input is required");
//     }
//     const encryptedPassword=await bcrypt.hash(password,10);
//     const user = await pool.query("INSERT INTO register (f_name, phone, email, password) VALUES ($1, $2, $3, $4) RETURNING *", [f_name, phone, email, encryptedPassword]);

//     const token=jwt.sign(
//       {user_id: user._id, email},
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );
//     user.token = token;

//     res.status(201).json(user);

//   } catch (error) {
//     console.error(error.message);
//   }
// });
//to check exist user


//login
app.post("/login",async (req, res)=>{
  try {
    const {email, password}= req.body;
    const allEmails = await pool.query("SELECT * FROM register");
    var success = false;
    for (let index = 0; index < allEmails.rows.length; index++) {
      if (allEmails.rows[index].email==email && allEmails.rows[index].password==password) {
        success=true
        // res.status(200).json(allEmails.rows[index]);
        res.status(200).send("Succesfull");
      }
    }
    if(success==false){
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.error(err.message);
  }
});

//get all products
app.get('/products', async (req, res) => {
  try {
    const allprods = await pool.query("SELECT * FROM product");
    res.json(allprods.rows);
  } catch (error) {
    console.log(error.message);
  }
});
//get all users
app.get('/register', async (req, res) => {
  try {
    const alluser = await pool.query("SELECT * FROM register");
    res.json(alluser.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//get a single product
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const prod = await pool.query("SELECT * FROM product WHERE product_id = $1", [id]);
    res.json(prod.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//update a product
app.put("/products/:id", upload.single('productImage'), async (req, res) => {
  try {
    const { id } = req.params;
    const img = req.file.path;

    const updateProd = await pool.query("UPDATE product SET img = $1 WHERE product_id = $2", [img, id]);
    res.json("Product Updated");

  } catch (error) {
    console.log(error.message);
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProd = await pool.query("DELETE FROM product WHERE product_id = $1", [id]);
    res.json("Product Deleted");

  } catch (error) {
    console.log(error.message);

  }
})
// Delete a user
app.delete("/register/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProd = await pool.query("DELETE FROM register WHERE id = $1", [id]);
    res.json("Product Deleted");

  } catch (error) {
    console.log(error.message);

  }
})


// create 


app.listen(PORT, () => {
  console.log(`Server is listening on: ${PORT}`);
})