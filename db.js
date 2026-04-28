const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.MYSQL_URL);

connection.connect(err => {
    if (err) {
        console.log('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL ✅');
});

module.exports = connection;
