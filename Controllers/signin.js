const Login = require('./models/Login');
const User = require('./models/User');

const handleSignin = (bcrypt) => async (req, res) => {
  const { email, password } = req.body;
  console.log('Logowanie użytkownika:', { email }); // Loguj email, aby zobaczyć, czy jest poprawnie przesyłany
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  try {
    const loginData = await Login.findOne({ email });
    if (!loginData) {
      console.log('Nie znaleziono użytkownika:', email); // Loguj brak użytkownika
      return res.status(400).json('wrong credentials');
    }

    const isValid = bcrypt.compareSync(password, loginData.hash);
    if (isValid) {
      const user = await User.findOne({ email });
      if (user) {
        console.log('Zalogowany użytkownik:', user); // Loguj dane użytkownika po zalogowaniu
        return res.json(user);
      } else {
        console.log('Nie znaleziono danych użytkownika po logowaniu:', email); // Loguj brak danych użytkownika
        return res.status(400).json('unable to get user');
      }
    } else {
      console.log('Błędne hasło dla użytkownika:', email); // Loguj błędne hasło
      return res.status(400).json('wrong credentials');
    }
  } catch (err) {
    console.error('Błąd przy logowaniu:', err); // Loguj błąd
    return res.status(500).json('error logging in');
  }
};

module.exports = { handleSignin };
