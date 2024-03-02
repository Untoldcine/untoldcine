const { PrismaClient} = require('@prisma/client')
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); 
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); 

const prisma = new PrismaClient();


exports.adminLogIn = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({"message" : "Missing email or password"})
    }
    if (email !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({"message" : "Incorrect credentials"})
    }
    return res.status(200).json({"message" : "Welcome Malcolm"})
}

exports.adminGetAll = async(req, res) => {
    const [seriesData, videoData, movieData, podcastData, btsSeriesData, btsMoviesData, countries, genres] = await Promise.all([
        prisma.series.findMany({
            where: {
                deleted: false
            },
            include: {
                series_country: {
                    select: {
                        country_id: true,
                        country: { 
                            select: {
                                country_id: true, 
                                country_name: true 
                            }
                        }
                    }
                }
            }
        }),
        prisma.videos.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.movies.findMany({
            where: {
                deleted: false
            },
        }),
        prisma.podcasts.findMany({
            where: {
                deleted: false
            },
        }),
        prisma.bTS_Series.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.bTS_Movies.findMany({
            where: {
                deleted: false
            },
            include: {
                movies: {
                    select: {
                        movie_name: true
                    }
                }
            }
        }),
        prisma.countries.findMany(),
        prisma.genres.findMany()
    ])
    res.status(200).json({series:seriesData, video: videoData, movie: movieData, podcasts: podcastData, bts_series: btsSeriesData, bts_movies: btsMoviesData, countries: countries, genres: genres})
}

exports.adminUpdate = async (req, res) => {
    //may need to capitalize the table params due to prisma schema shit
    const {table} = req.params
    // console.log(table);
    // console.log(req.body);

    if (table === 'series') {
        const updated = updateSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'video') {
        const updated = updateVideos(req.body)
        res.status(200).json(updated)
    }
    if (table === 'movie') {
        const updated = updateMovies(req.body)
        res.status(200).json(updated)
    }
    if (table === 'podcast') {
        const updated = updatePodcast(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_series') {
        const updated = updateBTSSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_movies') {
        const updated = updateBTSMovies(req.body)
        res.status(200).json(updated)
    }
 
}

async function updateSeries(obj) {
    const updateField = await prisma.series.update({
        where: {
            series_id: obj.series_id
        },
        data: {
            series_name: obj.series_name,
            series_status: obj.series_status,
            series_upvotes : parseInt(obj.series_upvotes) || 0,
            series_downvotes : parseInt(obj.series_downvotes) || 0,
            series_main : obj.series_main || null,
            series_directors : obj.series_director || null,
            series_producers : obj.series_producer || null,
            series_starring: obj.series_starring || null,
            series_thumbnail : obj.series_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
            completed: obj.completed === 'true'
        }
    })
    // console.log(updateField);
    return updateField

}

async function updateVideos(obj) {
    const updateField = await prisma.videos.update({
        where: {
            video_id: obj.video_id
        },
        data: {
            video_name: obj.video_name,
            video_main : obj.video_main || null,
            video_length: parseInt(obj.video_length) || 0,
            video_season: parseInt(obj.video_season) || 1,
            video_episode: parseInt(obj.video_episode) || 1,
            video_thumbnail : obj.video_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField

}

async function updateMovies(obj) {
    const updateField = await prisma.movies.update({
        where: {
            movie_id: obj.movie_id
        },
        data: {
            movie_name: obj.movie_name,
            movie_status: obj.movie_status,
            movie_main : obj.movie_main || null,
            movie_length: parseInt(obj.movie_length) || 0,
            movie_directors : obj.movie_directors || null,
            movie_producers : obj.movie_producers || null,
            movie_starring: obj.movie_starring || null,
            movie_thumbnail : obj.movie_thumbnail || null,
            movie_upvotes : parseInt(obj.movie_upvotes) || 0,
            movie_downvotes : parseInt(obj.movie_downvotes) || 0,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

async function updatePodcast(obj) {
    const updateField = await prisma.podcasts.update({
        where: {
            podcast_id: obj.podcast_id
        },
        data: {
            podcast_name: obj.podcast_name,
            podcast_status: obj.podcast_status,
            podcast_type: obj.podcast_type,
            podcast_main : obj.podcast_main || null,
            podcast_episode: parseInt(obj.podcast_episode) || 1,
            podcast_directors : obj.podcast_directors || null,
            podcast_producers : obj.podcast_producers || null,
            podcast_starring: obj.podcast_starring || null,
            podcast_thumbnail : obj.podcast_thumbnail || null,
            podcast_upvotes : parseInt(obj.podcast_upvotes) || 0,
            podcast_downvotes : parseInt(obj.podcast_downvotes) || 0,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

async function updateBTSSeries(obj) {
    const updateField = await prisma.bTS_Series.update({
        where: {
            bts_series_id: obj.bts_series_id
        },
        data: {
            bts_series_name: obj.bts_series_name,
            bts_series_main : obj.bts_series_main || null,
            bts_series_length: parseInt(obj.bts_series_length) || 0,
            bts_series_thumbnail: obj.bts_series_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}
async function updateBTSMovies(obj) {
    const updateField = await prisma.bTS_Movies.update({
        where: {
            bts_movies_id: obj.bts_movies_id
        },
        data: {
            bts_movies_name: obj.bts_movies_name,
            bts_movies_main : obj.bts_movies_main || null,
            bts_movies_length: parseInt(obj.bts_movies_length) || 0,
            bts_movies_thumbnail: obj.bts_movies_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

function convertToISOString(inputDate) {
    const date = new Date(inputDate);
    const isoString = date.toISOString();

    return isoString;
}

exports.adminDelete = async (req, res) => {
    const {table, id} = req.params

    let insertionTable
    let insertionID 
    let deleteTableEntry

    switch(table) {
        case 'series':
            insertionTable = 'Series'
            insertionID = 'series_id'
            deleteTableEntry = 'Series'
            break;
        case 'movie':
            insertionTable = 'Movies'
            insertionID = 'movie_id'
            deleteTableEntry = 'Movie'
            break;
        case 'podcast':
            insertionTable = 'Podcasts'
            insertionID = 'podcast_id'
            deleteTableEntry = 'Podcast'
            break;
        case 'bts_series':
            insertionTable = 'BTS_Series'
            insertionID = 'bts_series_id'
            deleteTableEntry = 'BTS_Series'
            break;
        case 'bts_movies':
            insertionTable = 'BTS_Movies'
            insertionID = 'bts_movies_id'
            deleteTableEntry = 'BTS_Movie'
            break;
    }
    const flagForDeletion = await prisma[insertionTable].update({
        where: {
            [insertionID]: parseInt(id)
        },
        data: {
            deleted: true,
            deleted_at: new Date()
        }
    }) 
    const newDeleteEntry = await prisma.deleted_Content.create({
        data: {
            content_type: deleteTableEntry,
            content_id: parseInt(id)
        }
    })
    if (flagForDeletion && newDeleteEntry) {
        res.status(200).json({"message": "Deletion successful"})
    }
}

exports.adminAdd = async (req, res) => {
    // const {name, status, podcast_type, date, main, directors, starring, producers, length, season, episode, country, genres, table} = req.body
    const {table} = req.body

    if (table === 'series') {
        const post = addSeries(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
        
    }
    if (table === 'video') {
        const post = addVideo(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
    }
    if (table === 'movie') {
        const post = addMovie(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
    }
    if (table === 'podcast') {
        const post = addPodcast(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
    }
    if (table === 'bts_series') {
        const post = addBTSSeries(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
    }
    if (table === 'bts_movies') {
        const post = addBTSMovies(req.body)
        if (post) {
            res.status(200).json({"message": "Success"})
        }
    }
}

async function addSeries(obj) {
    const {name, status, date, main, directors, starring, producers, country, genreIDs} = obj
    const newSeries = await prisma.series.create({
        data: {
            series_name: name,
            series_status: status,
            date_created: new Date(date),
            series_main: main,
            series_directors: directors,
            series_producers: producers,
            series_starring: starring,
            series_upvotes: 0,
            series_downvotes: 0,
            completed: false,
            deleted: false,
            deleted_at: null
        }
    })
    const countryPromise = prisma.series_Countries.create({
        data: {
            series_id: newSeries.series_id,
            country_id: parseInt(country)
        }
    });

    const genrePromises = genreIDs.map(genreId => prisma.series_Genres.create({
        data: {
            series_id: newSeries.series_id,
            genre_id: parseInt(genreId)
        }
    }));

    await Promise.all([countryPromise, ...genrePromises]);
    return newSeries

}

async function addVideo(obj) {
    const {name, date, main, parentID, length, season, episode } = obj
    const newVideo = await prisma.videos.create({
        data: {
            video_name: name,
            video_main: main,
            date_created: new Date(date),
            video_length: parseInt(length),
            video_season: parseInt(season),
            video_episode: parseInt(episode),
            parent_series_id: parseInt(parentID),
            deleted: false,
            deleted_at: null
        }
    })
    return newVideo;
}

async function addMovie(obj) {
    const {name, status, date, main, directors, starring, producers, country, genreIDs, length} = obj
    const newMovie = await prisma.movies.create({
        data: {
            movie_name: name,
            movie_status: status,
            date_created: new Date(date),
            movie_length: parseInt(length),
            movie_main: main,
            movie_directors: directors,
            movie_producers: producers,
            movie_starring: starring,
            movie_upvotes: 0,
            movie_downvotes: 0,
            deleted: false,
            deleted_at: null
        }
    })
    const countryPromise = prisma.movie_Countries.create({
        data: {
            movie_id: newMovie.movie_id,
            country_id: parseInt(country)
        }
    });

    const genrePromises = genreIDs.map(genreId => prisma.movie_Genres.create({
        data: {
            movie_id: newMovie.movie_id,
            genre_id: parseInt(genreId)
        }
    }));

    await Promise.all([countryPromise, ...genrePromises]);
    return newMovie
}

async function addPodcast(obj) {
    const {name, podcast_type, date, main, directors, starring, producers, country, episode} = obj
    const newPodcast = await prisma.podcasts.create({
        data: {
            podcast_name: name,
            podcast_type: podcast_type,
            podcast_main: main,
            podcast_directors: directors,
            podcast_producers: producers,
            podcast_starring: starring,
            podcast_upvotes: 0,
            podcast_downvotes: 0,
            podcast_episode: parseInt(episode),
            date_created: new Date(date),
            deleted: false,
            deleted_at: null
        }
    })
    await prisma.podcast_Countries.create({
        data: {
            podcast_id: newPodcast.podcast_id,
            country_id: parseInt(country)
        }
    });

    return newPodcast
}

async function addBTSSeries(obj) {
    const {name, date, main, parentID, length, episode} = obj
    const newBTSSeries = await prisma.bTS_Series.create({
        data: {
            bts_series_name: name,
            bts_series_main: main,
            date_created: new Date(date),
            bts_series_length: parseInt(length),
            bts_series_episode: parseInt(episode),
            parent_series_id: parseInt(parentID)
        }
    })
    return newBTSSeries
}

async function addBTSMovies(obj) {
    const {name, date, main, parentID, length, episode} = obj
    const newBTSMovie = await prisma.bTS_Movies.create({
        data: {
            bts_movies_name: name,
            bts_movies_main: main,
            date_created: new Date(date),
            bts_movies_length: parseInt(length),
            bts_movies_episode: parseInt(episode),
            parent_movie_id: parseInt(parentID)
        }
    })
    return newBTSMovie
}

//hits this endpoint everytime attempting to upload
exports.getSignedUrl = async (req, res) => {
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: "hello", 
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        res.json({ url });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URL');
    }
};