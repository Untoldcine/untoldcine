import {useState, useEffect} from 'react'
import axios from "axios";
import ActiveSeries from "./SubActive/ActiveSeries"
import ActiveVideo from "./SubActive/ActiveVideo"
import ActiveMovie from "./SubActive/ActiveMovie"
import ActivePodcast from "./SubActive/ActivePodcast"
import ActiveBTSSeries from "./SubActive/ActiveBTSSeries"
import ActiveBTSMovies from "./SubActive/ActiveBTSMovies"

const convertDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const readableDate = dateObj.toLocaleDateString('en-US', options);
    return readableDate;
}

const handleChangedData = async (e, type, original, inputs, urls, links, setUpload) => {
    e.preventDefault()
    //post the new data, retrieve generated signed s3 links, if the asset was updated and therefore TRUE, then PUT to s3 bucket. Otherwise, move on
    try {
        const res = await axios.post(`http://localhost:3001/api/user/adminUpdate/${type}`, {inputs, original})
        await Promise.all(res.data.map(async (url) => {
            let fileData = null
            let headers = {}
            if (url.includes('thumbnails') && urls.thumbnail) {
                fileData = links.thumbnail;
                headers['Content-Type'] = 'image/webp';
            } else if (url.includes('heros') && urls.hero) {
                fileData = links.hero;
                headers['Content-Type'] = 'image/webp';
            } else if (url.includes('content') && urls.content) {
                fileData = links.content;
                headers['Content-Type'] = 'video/mp4';
            } else {
                return; 
            }
            return axios.put(url, fileData, {
                headers: headers,
                onUploadProgress: progressEvent => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUpload(percentCompleted);
                }
            });
        }));
        alert('Update Success!');
        setUpload(0);
    }
    catch (err) {
        if (err.response) {
          console.error(err.response.data.message); 
        }
        console.error(err + ': Error attempting to edit content data by an Admin');
      }
}

const handleDeleteData = async (e, type, id) => {
    e.preventDefault()
    try {
        const res = await axios.post(`http://localhost:3001/api/user/adminDelete/${type}/${id}`)
        console.log(res.data);
    }
    catch (err) {
        if (err.response) {
          console.error(err.response.data.message); 
        }
        console.error(err + ': Error attempting to delete data by an Admin');
      }
}


//There are several IF statement blocks that have similar markup. They exist as conditional rendering depending on the type of properties being passed.
//In this case, the type of content that ADMIN is editing (i.e. Series, Videos, Movies, Podcasts, BTS)

const Active = ({type, details}) => {
    if (type === 'series') {
        return<ActiveSeries details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/>
    }
    if (type === 'video') {
        return<ActiveVideo details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/>
    }
    if (type === 'movie') {
        return<ActiveMovie details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/> 
    }
    if (type === 'podcast') {
       return <ActivePodcast details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/> 
    }
    if (type === 'bts_series') {
       return <ActiveBTSSeries details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/> 
    }
    if (type === 'bts_movies') {
       return <ActiveBTSMovies details = {details} convertDate={convertDate} upload = {handleChangedData} deleteContent = {handleDeleteData}/> 
    }
}

export default Active