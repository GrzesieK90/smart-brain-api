const User = require('./models/User');

const handleProfileGet = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('error getting user'));
};

module.exports = { handleProfileGet };
