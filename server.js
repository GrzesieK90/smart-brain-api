const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = {
  DATABASE_URL: `postgresql://${{ PGUSER }}:${{ PGPASSWORD }}@${{ PGHOST }}:${{ PGPORT }}/${{ PGDATABASE }}`,
  PGDATABASE: 'railway',
  PGHOST: 'containers-us-west-175.railway.app',
  PGPASSWORD: 'oDTU5W1no0DM1pdY74tw',
  PGPORT: 5728,
  PGUSER: 'postgres'
}


const app = express();

app.use(cors())
app.use(express.json()); 

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=> { console.log(`app is running on port ${process.env.PORT}`) })