const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: "postgresql://postgres:16TyxHExLlnHYZXxVftD@containers-us-west-137.railway.app:6538/railway",
    ssl: { rejectUnauthorized: false }
  }
});

const app = express();

app.use(cors())
app.use(express.json()); 

app.get('/', (req, res)=> { res.send('it is working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PGPORT  || 3000, ()=> { console.log(`App is running on port ${process.env.PORT }!`) })
