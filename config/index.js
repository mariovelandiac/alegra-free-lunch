require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    marketPlace: {
      url: process.env.MARKETPLACE_URL
    },
    warehouse: {
      host: process.env.WAREHOUSE_HOST || 'http://localhost',
      port: process.env.WAREHOUSE_PORT || 3001,
      key: process.env.WAREHOUSE_KEY
    },
    aws: {
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

module.exports = config
