const mysql = require('mysql2');

const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL ✅');
    connection.release();
});

module.exports = pool;
