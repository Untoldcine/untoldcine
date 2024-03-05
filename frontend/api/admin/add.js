const { PrismaClient} = require('@prisma/client')
require('dotenv').config();
const { S3Client, PutObjectCommand} = require('@aws-sdk/client-s3'); 
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); 
const cfsign = require('aws-cloudfront-sign');

const prisma = new PrismaClient();

// /api/admin/add - body should include everything

module.exports = async (req, res) => {
    const {table} = req.body

    if (table === 'series') {
        const post = await addSeries(req.body)
        if (post) {
            res.status(200).json(post)
        }
    }
    if (table === 'video') {
        const post = await addVideo(req.body)
        if (post) {
            res.status(200).json(post)
        }
    }
    if (table === 'movie') {
        const post = await addMovie(req.body)
        if (post) {
            res.status(200).json(post)
        }
    }
    if (table === 'podcast') {
        const post = await addPodcast(req.body)
        if (post) {
            res.status(200).json(post)
        }
    }
    if (table === 'bts_series') {
        const post = await addBTSSeries(req.body)
        if (post) {
            res.status(200).json(post)
        }
    }
    if (table === 'bts_movies') {
        const post = await addBTSMovies(req.body)
        if (post) {
            res.status(200).json(post)
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

    //generate the credentials for S3
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newSeries.series_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `series/thumbnails/id${newSeries.series_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `series/heros/id${newSeries.series_id}${insertionName}.webp`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        return [urlThumbnail, urlHero]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }

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

    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newVideo.video_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/thumbnails/id${newVideo.video_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/content/id${newVideo.video_id}${insertionName}.mp4`, 
    });
    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlContent]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }

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
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newMovie.movie_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/thumbnails/id${newMovie.movie_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/heros/id${newMovie.movie_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/content/id${newMovie.movie_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlHero, urlContent]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }
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
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newPodcast.podcast_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/thumbnails/${insertionName}/id${newPodcast.podcast_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/heros/${insertionName}/id${newPodcast.podcast_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/content/${insertionName}/id${newPodcast.podcast_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlHero, urlContent]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }
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
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newBTSSeries.bts_series_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_series/thumbnails/${insertionName}/id${newBTSSeries.bts_series_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_series/content/${insertionName}/id${newBTSSeries.bts_series_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlContent]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }
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
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });   
    
    const insertionName = getURLNamePath(newBTSMovie.bts_movies_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_movies/thumbnails/${insertionName}/id${newBTSMovie.bts_movies_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_movies/content/${insertionName}/id${newBTSMovie.bts_movies_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlContent]

    } catch (err) {
        console.error(err);
        return res.status(500).send('Could not generate pre-signed URLs');
    }
}

const getURLNamePath = (name) => {
    //replace all spaces
    return name.toLowerCase().replace(/\s+/g, "_")
}