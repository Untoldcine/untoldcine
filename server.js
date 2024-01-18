const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

const userRoute = require('./routes/userRoute.js')
const seriesRoute = require('./routes/seriesRoute.js')
const commentsRoute = require('./routes/commentsRoute.js')
const podcastsRoute = require('./routes/podcastsRoute.js')
const btsRoute = require('./routes/btsRoute.js')
const watchlistRoute = require('./routes/watchlistRoute.js')


app.use(cors({"origin": 'http://localhost:3000'})); //temporary until we go live
app.use(express.json())

app.use('/api/user', userRoute);
app.use('/api/series', seriesRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/podcast', podcastsRoute);
app.use('/api/bts', btsRoute)
app.use('/api/watchlist', watchlistRoute);


app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
