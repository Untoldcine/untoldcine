const connectDB = require('./connectDB')

exports.getSummaryBTS = async (_req, res) => {
    const connection = connectDB();
    const query = 'SELECT series_name, ID, status FROM series'
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving summary of BTS data during database operation'})
        }
        const pre = []
        const prod = []
        const post = []
        results.forEach((series) => {
            if (series.status === 'pre') {
                pre.push(series)
            }
            if (series.status === 'prod') {
                prod.push(series)
            }if (series.status === 'post') {
                post.push(series)
            }
        })
        res.status(200).json({"pre": pre, "prod":prod, "post":post})
    })
}

exports.getSpecificBTS = async (req, res) => {
    const {seriesID} = req.params;
    const connection = connectDB();
    const query = `SELECT bts.id, bts.name, bts.episode, bts.description, bts.date_created, series.description AS series_description from bts JOIN series ON bts.series_id = series.id WHERE series_id = ${seriesID}`
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving specific BTS data during database operation'})
        }
        res.status(200).json({results})
    })
}