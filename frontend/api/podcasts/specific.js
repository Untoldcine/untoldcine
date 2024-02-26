const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cfsign = require('aws-cloudfront-sign');

const signingParams = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
}
const distributionURL = 'https://d3t2pr7vhgu8da.cloudfront.net'

module.exports = async (req, res) => {
    const { id } = req.params

    try {
        const data = await prisma.podcasts.findFirst({
            where: {
                podcast_id: id
            }
        })
        if (data) {
            const urlString = getURLNameFromDB(data.podcast_name)
            const signedUrlContent = cfsign.getSignedUrl(
                `${distributionURL}/podcasts/content/${urlString}/${urlString}${data.podcast_episode}.mp4`, 
                signingParams
              );
             const processedData = {
                ...data,
                podcast_signed: signedUrlContent,
            }
            res.status(200).json(processedData)
        }
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of podcast at id ${podcastID}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}

const getURLNameFromDB = (name) => {
    //replace all spaces
    return name.toLowerCase().replace(/\s+/g, "_")
}
