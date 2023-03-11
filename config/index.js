require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    marketPlace: {
      url: process.env.MARKETPLACE_URL
    },
    warehouse: {
      host: process.env.WAREHOUSE_HOST || 'localhost',
      port: process.env.WAREHOUSE_PORT || 3001
    }
}

module.exports = config
