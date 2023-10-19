const path = require("path");
const app = require(path.join(__dirname, "app"));

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening in port: ${port}`));
