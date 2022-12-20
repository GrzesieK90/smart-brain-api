const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { createClient } = require('@supabase/supabase-js')

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

const db = createClient(
  'https://mdaquwtehnfqgxfyqvvg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYXF1d3RlaG5mcWd4ZnlxdnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0NzUxMDIsImV4cCI6MTk4NzA1MTEwMn0.o-772Rj6SAFU7y4rPOUJlQAOrZE7zYVt5UcxR1pE8GA'
);

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