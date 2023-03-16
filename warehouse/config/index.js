require('dotenv').config({path:__dirname+'/./../.env'});

const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3001,
    host: process.env.HOST || 'http://localhost',
    apiKey: process.env.WAREHOUSE_API_KEY,
    marketPlace: {
      url: process.env.MARKETPLACE_URL
    },
    ingredients: {
      max: process.env.INGREDIENTS_MAX || 10
    },
    aws: {
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      tableName: process.env.AWS_TABLE_NAME,
      region: process.env.AWS_REGION
    }
}

module.exports = config
