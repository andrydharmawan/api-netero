module.exports = {
    dbOptions: {
        host: process.env.DBHOST,
        dialect: "mysql",
        database: process.env.DBDATABASE,
        port: 3306,
        username: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        logging: false
    },
    options: {
      type: "js",
      dir: "./server/models",
      camelCase: true,
   }
}