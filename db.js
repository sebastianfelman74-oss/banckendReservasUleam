const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reservas_uleam'
});

connection.connect(err => {
    if (err) {
        console.log('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL ✅');
});

module.exports = connection;