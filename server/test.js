const bcrypt = require('bcryptjs');

bcrypt.compare('lololol', '$2b$12$nuVyoNNmRydZ8G7uILeL9OW7FWBogUdIAHtKLGFVKhiq2ejipSnvG')
  .then(result => console.log('Match:', result));