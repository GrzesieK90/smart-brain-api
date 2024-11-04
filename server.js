require('dotenv').config(); // Dodaj to na początku pliku
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const mongoose = require('mongoose');

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');

// Połączenie z MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsInsecure: true // Dodaj tę linię
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.send('it is working') });
app.post('/signin', signin.handleSignin(bcrypt));
app.post('/register', register.handleRegister(bcrypt));
app.get('/profile/:id', profile.handleProfileGet);
app.put('/image', image.handleImage);
app.post('/imageurl', image.handleApiCall);

const port = 3001;
app.listen(port, () => { console.log(`App is running on port ${port}`) });
