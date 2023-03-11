require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    marketPlace: {
      url: process.env.MARKETPLACE_URL
    }
}

module.exports = config
