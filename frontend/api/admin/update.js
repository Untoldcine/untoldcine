const { PrismaClient} = require('@prisma/client')
require('dotenv').config();
const { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3'); 
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); 
const cfsign = require('aws-cloudfront-sign');

const prisma = new PrismaClient();

// /api/admin/update - pass into body {updatedValues, table}

module.exports = async (req, res) => {
    const {updatedValues, table} = req.body
    if (table === 'series') {
        const updated = await updateSeries(updatedValues)
        res.status(200).json(updated)
    }
    if (table === 'video') {
        const updated = await updateVideos(updatedValues)
        res.status(200).json(updated)
    }
    if (table === 'movie') {
        const updated = await updateMovies(updatedValues)
        res.status(200).json(updated)
    }
    if (table === 'podcast') {
        const updated = await updatePodcast(updatedValues)
        res.status(200).json(updated)
    }
    if (table === 'bts_series') {
        const updated = await updateBTSSeries(updatedValues)
        res.status(200).json(updated)
    }
    if (table === 'bts_movies') {
        const updated = await updateBTSMovies(updatedValues)
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