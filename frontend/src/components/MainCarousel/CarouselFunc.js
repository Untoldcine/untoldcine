import axios from "axios"

export const getAllContentData = async () => {
    const [seriesData, movieData, podcastData, btsData] = await Promise.all([
        await axios.get('http://localhost:3001/api/series/seriesSummary/'),
        await axios.get('http://localhost:3001/api/movies/movieSummary'),
        await axios.get('http://localhost:3001/api/podcast/podcastSummary/'),
        await axios.get('http://localhost:3001/api/bts/summaryBTSall')
    ])
    return {series: seriesData, movies: movieData, podcasts: podcastData, bts: btsData}
}

export const getSeriesData = async () => {
    const res = await axios.get('http://localhost:3001/api/series/seriesSummary/')
    return res.data
}

export const getMovieData = async () => {
    const res = await axios.get('http://localhost:3001/api/movies/movieSummary')
    return res.data
}

export const getPodcastData = async () => {
    const res = await axios.get('http://localhost:3001/api/podcast/podcastSummary')
    return res.data
}

export const getBTSData = async () => {
    const res = await axios.get('http://localhost:3001/api/bts/summaryBTSAllArray')
    console.log(res.data);
    return res.data
}



