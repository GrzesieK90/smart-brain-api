const Login = require('./models/Login');
const User = require('./models/User');

const handleRegister = (bcrypt) => async (req, res) => {
  const { email, name, password } = req.body;
  console.log('Rejestracja użytkownika:', { email, name, password });

  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  try {
    // Tworzenie dokumentu logowania
    const newLogin = new Login({ email, hash });
    const loginResult = await newLogin.save();
    console.log('Login zapisany w bazie:', loginResult);

    // Tworzenie dokumentu użytkownika
    const newUser = new User({ email, name, joined: new Date() });
    const userResult = await newUser.save();
    console.log('Użytkownik zapisany w bazie:', userResult);

    // Zwracanie zapisanego użytkownika do klienta
    res.json(userResult);
  } catch (err) {
    console.error('Błąd przy rejestracji:', err);
    res.status(400).json('unable to register');
  }
};

module.exports = { handleRegister };
