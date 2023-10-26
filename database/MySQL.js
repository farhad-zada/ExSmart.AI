const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DB = process.env.MYSQL_DB;

const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
});

connection.connect((val) => {
  console.log("connectded");
});

connection.query("SELECT * FROM `claims`", (err, rows, fields) => {
  if (err) console.log(err.stack);
  console.log(rows);
  console.log(fields);
});
