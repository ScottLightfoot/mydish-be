require("dotenv").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST_DEV,
      database: process.env.DB_NAME_DEV,
      user: process.env.DB_USER_DEV,
      password: process.env.DB_PASSWORD_DEV
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST_PROD,
      database: process.env.DB_NAME_PROD,
      user: process.env.DB_USER_PROD,
      password: process.env.DB_PASSWORD_PROD
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
  testing: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST_TEST,
      database: process.env.DB_NAME_TEST,
      user: process.env.DB_USER_TEST,
      password: process.env.DB_PASSWORD_TEST
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
};
