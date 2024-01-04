const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

const helloRoute = require('./routes/helloRoute.js');
const userRoute = require('./routes/userRoute.js')

app.use(cors({"origin": 'http://localhost:3000'})); //temporary until we go live
app.use(express.json())


app.use('/api/hello', helloRoute);
app.use('/api/user', userRoute)


app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
