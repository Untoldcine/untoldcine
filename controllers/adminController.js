const { PrismaClient} = require('@prisma/client')
require('dotenv').config();
const { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); 
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); 
const cfsign = require('aws-cloudfront-sign');

const prisma = new PrismaClient();

exports.adminGetHero = async (req, res) => {
    try {
        const heroEntries = await prisma.current_Hero.findMany();
        if (heroEntries && heroEntries.length > 0) {
            const heroID = heroEntries[0]; 
            if (heroID.table_name === 'series') {
                const getSeriesHero = await prisma.series.findFirst({
                    where: {
                        series_id: heroID.content_id
                    }
                })
            }
        } else {
            console.log("No entries found in '.");
            res.status(404).send("No hero entry found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while fetching the hero entry.");
    }
}

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
            include: {
                movie_country: {
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
    const processedSeries = await getSeriesAssets(seriesData)
    const processedVideos = await getVideoAssets(videoData)
    const processedMovies = await getMovieAssets(movieData)
    const processedPodcasts = await getPodcastAssets(podcastData)
    const processedBTSSeries = await getBTSSeriesAssets(btsSeriesData)
    const processedBTSMovies = await getBTSMoviesAssets(btsMoviesData)

    res.status(200).json({series:processedSeries, video: processedVideos, movie: processedMovies, podcast: processedPodcasts, bts_series: processedBTSSeries, bts_movies: processedBTSMovies, countries: countries, genres: genres})
}

//for getting CDN content
const distributionURL = 'https://d3t2pr7vhgu8da.cloudfront.net'
const signingParams = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
}

async function getSeriesAssets(arrayOfSeries) {
    const arr = arrayOfSeries.map((series) => {
        const urlString = getURLNamePath(series.series_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/series/thumbnails/id${series.series_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/series/heros/id${series.series_id}${urlString}.webp`, 
            signingParams 
        )
        return {
            ...series,
            series_country: {country_name: series.series_country[0].country.country_name, country_id: series.series_country[0].country_id},
            series_thumbnail: signedThumbnail,
            series_hero: signedHero
        }
    })
    return arr
}
async function getVideoAssets(arrayofVideos) {
    const arr = arrayofVideos.map((video) => {
        const urlString = getURLNamePath(video.video_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/videos/thumbnails/id${video.video_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/videos/content/id${video.video_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...video,
            video_thumbnail: signedThumbnail,
            video_url: signedContent
        }
    })
    return arr
}
async function getMovieAssets(arrayOfMovies) {
    const arr = arrayOfMovies.map((movie) => {
        const urlString = getURLNamePath(movie.movie_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/movies/thumbnails/id${movie.movie_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/movies/heros/id${movie.movie_id}${urlString}.webp`, 
            signingParams 
        )
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/movies/content/id${movie.movie_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...movie,
            movie_country: {country_name: movie.movie_country[0].country.country_name, country_id: movie.movie_country[0].country_id},
            movie_thumbnail: signedThumbnail,
            movie_hero: signedHero,
            movie_url: signedContent
        }
    })
    return arr
}
async function getPodcastAssets(arrayOfPodcasts) {
    const arr = arrayOfPodcasts.map((podcast) => {
        const urlString = getURLNamePath(podcast.podcast_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/thumbnails/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/heros/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
            signingParams 
        )
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/content/${urlString}/id${podcast.podcast_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...podcast,
            podcast_thumbnail: signedThumbnail,
            podcast_hero: signedHero,
            podcast_url: signedContent
        }
    })
    return arr
}
async function getBTSSeriesAssets(array) {
    const arr = array.map((bts_series) => {
        const urlString = getURLNamePath(bts_series.bts_series_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/bts_series/thumbnails/${urlString}/id${bts_series.bts_series_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/bts_series/content/${urlString}/id${bts_series.bts_series_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...bts_series,
            bts_series_thumbnail: signedThumbnail,
            bts_series_url: signedContent
        }
    })
    return arr
}
async function getBTSMoviesAssets(array) {
    const arr = array.map((bts_movie) => {
        const urlString = getURLNamePath(bts_movie.bts_movies_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/bts_movies/thumbnails/${urlString}/id${bts_movie.bts_movies_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/bts_movies/content/${urlString}/id${bts_movie.bts_movies_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...bts_movie,
            bts_movies_thumbnail: signedThumbnail,
            bts_movies_url: signedContent
        }
    })
    return arr
}

exports.adminUpdate = async (req, res) => {
    const {table} = req.params
    if (table === 'series') {
        const updated = await updateSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'video') {
        const updated = await updateVideos(req.body)
        res.status(200).json(updated)
    }
    if (table === 'movie') {
        const updated = await updateMovies(req.body)
        res.status(200).json(updated)
    }
    if (table === 'podcast') {
        const updated = await updatePodcast(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_series') {
        const updated = await updateBTSSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_movies') {
        const updated = await updateBTSMovies(req.body)
        res.status(200).json(updated)
    }
}

//renames paths in S3 if the content name has been changed
async function updateNewNamePath(updated, old, type){ 
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    });

    if (type === 'series') {
        const oldInsertionName = getURLNamePath(old.series_name)
        const newInsertionName = getURLNamePath(updated.series_name)

        const oldThumbnailKey = `series/thumbnails/id${old.series_id}${oldInsertionName}.webp`
        const newThumbnailKey = `series/thumbnails/id${old.series_id}${newInsertionName}.webp`
        const oldHeroKey = `series/heros/id${old.series_id}${oldInsertionName}.webp`
        const newHeroKey = `series/heros/id${old.series_id}${newInsertionName}.webp`
        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
    
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldHeroKey}`,
                Key: newHeroKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldHeroKey,
            }));
        }
        catch (err) {
            console.error(err);
            throw new Error('Error updating S3 asset paths for series');
        }
    }
    if (type === 'video') {
        const oldInsertionName = getURLNamePath(old.video_name)
        const newInsertionName = getURLNamePath(updated.video_name)

        const oldThumbnailKey = `videos/thumbnails/id${updated.video_id}${oldInsertionName}.webp`
        const newThumbnailKey = `videos/thumbnails/id${updated.video_id}${newInsertionName}.webp`
        const oldContentKey = `videos/content/id${updated.video_id}${oldInsertionName}.mp4`
        const newContentKey = `videos/content/id${updated.video_id}${newInsertionName}.mp4`

        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldContentKey}`,
                Key: newContentKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldContentKey,
            }));    
        }
            catch (err) {
                console.error(err);
                throw new Error('Error updating S3 asset paths for videos');
            }
    } 
    if (type === 'movie') {
        const oldInsertionName = getURLNamePath(old.movie_name)
        const newInsertionName = getURLNamePath(updated.movie_name)

        const newThumbnailKey = `movies/thumbnails/id${updated.movie_id}${newInsertionName}.webp`
        const oldThumbnailKey = `movies/thumbnails/id${updated.movie_id}${oldInsertionName}.webp`
        const oldHeroKey = `movies/heros/id${updated.movie_id}${oldInsertionName}.webp`
        const newHeroKey = `movies/heros/id${updated.movie_id}${newInsertionName}.webp`
        const oldContentKey = `movies/content/id${updated.movie_id}${oldInsertionName}.mp4`
        const newContentKey = `movies/content/id${updated.movie_id}${newInsertionName}.mp4`

        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldHeroKey}`,
                Key: newHeroKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldHeroKey,
            })); 
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldContentKey}`,
                Key: newContentKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldContentKey,
            }));    
        }
            catch (err) {
                console.error(err);
                throw new Error('Error updating S3 asset paths for movies');
            }
    } 
    if (type === 'podcast') {
        const oldInsertionName = getURLNamePath(old.podcast_name)
        const newInsertionName = getURLNamePath(updated.podcast_name)

        const oldThumbnailKey = `podcasts/thumbnails/${oldInsertionName}/id${updated.podcast_id}${oldInsertionName}.webp`
        const newThumbnailKey = `podcasts/thumbnails/${newInsertionName}/id${updated.podcast_id}${newInsertionName}.webp`
        const oldHeroKey = `podcasts/heros/${oldInsertionName}/id${updated.podcast_id}${oldInsertionName}.webp`
        const newHeroKey = `podcasts/heros/${newInsertionName}/id${updated.podcast_id}${newInsertionName}.webp`
        const oldContentKey = `podcasts/content/${oldInsertionName}/id${updated.podcast_id}${oldInsertionName}.mp4`
        const newContentKey = `podcasts/content/${newInsertionName}/id${updated.podcast_id}${newInsertionName}.mp4`

        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldHeroKey}`,
                Key: newHeroKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldHeroKey,
            })); 
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldContentKey}`,
                Key: newContentKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldContentKey,
            }));    
        }
            catch (err) {
                console.error(err);
                throw new Error('Error updating S3 asset paths for podcasts');
            }
    } 
    if (type === 'bts_series') {
        const oldInsertionName = getURLNamePath(old.bts_series_name)
        const newInsertionName = getURLNamePath(updated.bts_series_name)

        const oldThumbnailKey = `bts_series/thumbnails/${oldInsertionName}/id${updated.bts_series_id}${oldInsertionName}.webp`
        const newThumbnailKey = `bts_series/thumbnails/${newInsertionName}/id${updated.bts_series_id}${newInsertionName}.webp`
        const oldContentKey = `bts_series/content/${oldInsertionName}/id${updated.bts_series_id}${oldInsertionName}.mp4`
        const newContentKey = `bts_series/content/${newInsertionName}/id${updated.bts_series_id}${newInsertionName}.mp4`

        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldContentKey}`,
                Key: newContentKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldContentKey,
            }));    
        }
            catch (err) {
                console.error(err);
                throw new Error('Error updating S3 asset paths for bts series');
            }
    } 
    if (type === 'bts_movie') {
        const oldInsertionName = getURLNamePath(old.bts_movies_name)
        const newInsertionName = getURLNamePath(updated.bts_movies_name)

        const oldThumbnailKey = `bts_movies/thumbnails/${oldInsertionName}/id${updated.bts_movies_id}${oldInsertionName}.webp`
        const newThumbnailKey = `bts_movies/thumbnails/${newInsertionName}/id${updated.bts_movies_id}${newInsertionName}.webp`
        const oldContentKey = `bts_movies/content/${oldInsertionName}/id${updated.bts_movies_id}${oldInsertionName}.mp4`
        const newContentKey = `bts_movies/content/${newInsertionName}/id${updated.bts_movies_id}${newInsertionName}.mp4`

        try {
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldThumbnailKey}`,
                Key: newThumbnailKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldThumbnailKey,
            }));
            await s3Client.send(new CopyObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                CopySource: `${process.env.S3_BUCKET_NAME}/${oldContentKey}`,
                Key: newContentKey,
            }));
            await s3Client.send(new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldContentKey,
            }));    
        }
            catch (err) {
                console.error(err);
                throw new Error('Error updating S3 asset paths for bts movies');
            }
    } 

}

async function updateSeries(obj) {
    const {inputs, original} = obj
    const updateField = await prisma.series.update({
        where: {
            series_id: inputs.series_id
        },
        data: {
            series_name: inputs.series_name,
            series_status: inputs.series_status,
            series_upvotes : parseInt(inputs.series_upvotes) || 0,
            series_downvotes : parseInt(inputs.series_downvotes) || 0,
            series_main : inputs.series_main || null,
            series_directors : inputs.series_director || null,
            series_producers : inputs.series_producer || null,
            series_starring: inputs.series_starring || null,
            series_thumbnail : inputs.series_thumbnail || null,
            date_created : convertToISOString(inputs.date_created),
            completed: inputs.completed === 'true'
        }
    })
    if (original.series_name !== inputs.series_name) {
        updateNewNamePath(inputs, original, 'series')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.series_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `series/thumbnails/id${inputs.series_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `series/heros/id${inputs.series_id}${insertionName}.webp`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        return [urlThumbnail, urlHero]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }

}

async function updateVideos(obj) {
    const {inputs, original} = obj

    const updateField = await prisma.videos.update({
        where: {
            video_id: inputs.video_id
        },
        data: {
            video_name: inputs.video_name,
            video_main : inputs.video_main || null,
            video_length: parseInt(inputs.video_length) || 0,
            video_season: parseInt(inputs.video_season) || 1,
            video_episode: parseInt(inputs.video_episode) || 1,
            video_thumbnail : inputs.video_thumbnail || null,
            date_created : convertToISOString(inputs.date_created),
        }
    })
    if (original.video_name !== inputs.video_name) {
        updateNewNamePath(inputs, original, 'video')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.video_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/thumbnails/id${inputs.video_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `videos/content/id${inputs.video_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlContent]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }

}

async function updateMovies(obj) {
    const {inputs, original} = obj

    const updateField = await prisma.movies.update({
        where: {
            movie_id: inputs.movie_id
        },
        data: {
            movie_name: inputs.movie_name,
            movie_status: inputs.movie_status,
            movie_main : inputs.movie_main || null,
            movie_length: parseInt(inputs.movie_length) || 0,
            movie_directors : inputs.movie_directors || null,
            movie_producers : inputs.movie_producers || null,
            movie_starring: inputs.movie_starring || null,
            movie_thumbnail : inputs.movie_thumbnail || null,
            movie_upvotes : parseInt(inputs.movie_upvotes) || 0,
            movie_downvotes : parseInt(inputs.movie_downvotes) || 0,
            date_created : convertToISOString(inputs.date_created),
        }
    })
    if (original.movie_name !== inputs.movie_name) {
        updateNewNamePath(inputs, original, 'movie')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.movie_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/thumbnails/id${inputs.movie_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/heros/id${inputs.movie_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `movies/content/id${inputs.movie_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlHero, urlContent]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }
}

async function updatePodcast(obj) {
    const {inputs, original} = obj

    const updateField = await prisma.podcasts.update({
        where: {
            podcast_id: inputs.podcast_id
        },
        data: {
            podcast_name: inputs.podcast_name,
            podcast_status: inputs.podcast_status,
            podcast_type: inputs.podcast_type,
            podcast_main : inputs.podcast_main || null,
            podcast_episode: parseInt(inputs.podcast_episode) || 1,
            podcast_directors : inputs.podcast_directors || null,
            podcast_producers : inputs.podcast_producers || null,
            podcast_starring: inputs.podcast_starring || null,
            podcast_thumbnail : inputs.podcast_thumbnail || null,
            podcast_upvotes : parseInt(inputs.podcast_upvotes) || 0,
            podcast_downvotes : parseInt(inputs.podcast_downvotes) || 0,
            date_created : convertToISOString(inputs.date_created),
        }
    })
    if (original.podcast_name !== inputs.podcast_name) {
        updateNewNamePath(inputs, original, 'podcast')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.podcast_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/thumbnails/${insertionName}/id${inputs.podcast_id}${insertionName}.webp`, 
    });
    const commandHero= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/heros/${insertionName}/id${inputs.podcast_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `podcasts/content/${insertionName}/id${inputs.podcast_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlHero = await getSignedUrl(s3Client, commandHero, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlHero, urlContent]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }

}
async function updateBTSSeries(obj) {
    const {inputs, original} = obj

    const updateField = await prisma.bTS_Series.update({
        where: {
            bts_series_id: inputs.bts_series_id
        },
        data: {
            bts_series_name: inputs.bts_series_name,
            bts_series_main : inputs.bts_series_main || null,
            bts_series_length: parseInt(inputs.bts_series_length) || 0,
            bts_series_thumbnail: inputs.bts_series_thumbnail || null,
            date_created : convertToISOString(inputs.date_created),
        }
    })
    if (original.bts_series_name !== inputs.bts_series_name) {
        updateNewNamePath(inputs, original, 'bts_series')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.bts_series_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_series/thumbnails/${insertionName}/id${inputs.bts_series_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_series/content/${insertionName}/id${inputs.bts_series_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlHero, urlContent]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }
    
}
async function updateBTSMovies(obj) {
    const {inputs, original} = obj

    const updateField = await prisma.bTS_Movies.update({
        where: {
            bts_movies_id: inputs.bts_movies_id
        },
        data: {
            bts_movies_name: inputs.bts_movies_name,
            bts_movies_main : inputs.bts_movies_main || null,
            bts_movies_length: parseInt(inputs.bts_movies_length) || 0,
            bts_movies_thumbnail: inputs.bts_movies_thumbnail || null,
            date_created : convertToISOString(inputs.date_created),
        }
    })
    if (original.bts_movies_name !== inputs.bts_movies_name) {
        updateNewNamePath(inputs, original, 'bts_movie')
    }
    const s3Client = new S3Client({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
    }); 
    const insertionName = getURLNamePath(updateField.bts_movies_name)
    const commandThumbnail = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_movies/thumbnails/${insertionName}/id${inputs.bts_movies_id}${insertionName}.webp`, 
    });
    const commandContent= new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `bts_movies/content/${insertionName}/id${inputs.bts_movies_id}${insertionName}.mp4`, 
    });

    try {
        const urlThumbnail = await getSignedUrl(s3Client, commandThumbnail, { expiresIn: 3600 });
        const urlContent = await getSignedUrl(s3Client, commandContent, { expiresIn: 3600 });
        return [urlThumbnail, urlContent]

    } catch (err) {
        console.error(err);
        throw new Error('Could not generate pre-signed URLs');
    }
    
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