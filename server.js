const express = require('express');
const cors = require('cors');

const helloRoute = require('./routes/helloRoute.js');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());


app.use('/api/hello', helloRoute);


app.listen(PORT, () => {
    console.log(`Server running on localhost::${PORT}`);
});
