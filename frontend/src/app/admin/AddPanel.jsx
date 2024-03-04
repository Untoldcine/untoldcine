import {useState, useEffect} from 'react'
import axios from "axios"

const AddPanel = ({allContent}) => {
    // console.log(allContent);

    const [type, setType] = useState('none')
    const [inputValues, setInputValues] = useState({name: '', status: 'pre', podcast_type: 'highlight', date: '', main: '', directors: '', starring: '', producers: '', length: '', season: '', episode: ''})
    const [uploadURLs, setUploadURLs] = useState({thumbnail: '', hero: '', content: ''})
    const [parentID, setParentID] = useState()
    const [countryID, setCountryID] = useState(1)
    const [genres, setGenres] = useState([])
    
    const handleChange = (e, field) => {
        setInputValues({ ...inputValues, [field]: e.target.value });
    };

    //prevents duplication of genres
    const handleGenreChange = (e) => {
        const genreId = e.target.value;
        const genreToAdd = allContent.genres.find(genre => genre.genre_id.toString() === genreId);
        if (genreToAdd && !genres.some(genre => genre.genre_id === genreToAdd.genre_id)) {
            setGenres([...genres, genreToAdd]);
        }
    };
    //removes genre on clicking the array elements
    const handleRemoveGenre = (genreIdToRemove) => {
        setGenres(genres.filter(genre => genre.genre_id.toString() !== genreIdToRemove.toString()));
    };

    //resets the input values to base state if the type of added content is being changed
    useEffect(() => {
        setInputValues({name: '', status: 'pre', podcast_type: 'highlight', date: '', main: '', directors: '', starring: '', producers: '', length: '', season: '', episode: ''})
        setCountryID(1)
        setGenres([])
        setUploadURLs({thumbnail: '', hero: '', content: ''})
    }, [type]);

    const updateUploadFiles = (e, field) => {
        const file = e.target.files[0]
        setUploadURLs({...uploadURLs, [field]:file})
    }

    const postNewContent = async (e) => {
        e.preventDefault()
        const genreIDs = genres.map(genre => genre.genre_id);

        const postObject = {
            ...inputValues,
            country: countryID,
            parentID,
            genreIDs,
            table: type
        }
        try {
            const res = await axios.post('http://localhost:3001/api/user/adminAdd/', postObject)
            res.data.forEach((url) => {
                if (url.includes('thumbnails')) {
                    axios.put(url, uploadURLs.thumbnail, { headers: { 'Content-Type': 'image/webp'} })
                }
                if (url.includes('heros')) {
                    axios.put(url, uploadURLs.hero, { headers: { 'Content-Type': 'image/webp'} })
                }
                if (url.includes('content')) {
                    axios.put(url, uploadURLs.content, { headers: { 'Content-Type': 'video/mp4'} })
                }
            })
            // alert('Post Success!')
            // location.reload();
        }
        catch (err) {
            if (err.response) {
              console.error(err.response.data.message); 
            }
            console.error(err + ': Error attempting to create new data by an Admin');
          }
    }
    
   

  return (
    <div className='active-wrapper'>
        <h4>Add New Content</h4>
        <p className='active-description'>Choose Content Type</p>
        <select value = {type} onChange = {(e) => setType(e.target.value)}>
            <option value ="none">None Selected</option>
            <option value ="series">Series</option>
            <option value ="video">Video</option>
            <option value ="movie">Movie</option>
            <option value ="podcast">Podcast</option>
            <option value ="bts_series">BTS Series</option>
            <option value ="bts_movies">BTS Movie</option>
        </select>
        
        {type !== 'none' ?
        <form onSubmit = {(e) => postNewContent(e)}>
        {/* Name */}
            <p>Content Name</p>
            <input className='editing_input-small' value = {inputValues.name} onChange = {(e) => handleChange(e, 'name')}></input>
        {type !== 'video' && type !== 'bts_series' && type !== 'bts_movies' && type !== 'podcast' ?
         <>

         {/* Status */}
             <p>Production Status</p>
             <select value={inputValues.status} onChange={(e) => handleChange(e, 'status')}>
                <option value='pre'>Pre-Production</option>
                <option value='post'>Production</option>
                <option value='prod'>Post-Production</option>
             </select>            
         </>
        : null}

        {/* Parent Series (for video & bts series) */}
        {type === 'video' || type === 'bts_series' ? 
         <>
            <p>Belongs to which Series?</p>
            <select value = {parentID || "placeholderValue"} onChange = {(e) => setParentID(e.target.value)}>
                <option disabled value = "placeholderValue">Select Parent Series</option>
                {allContent.series.map((series) => <option key = {series.series_id} value = {series.series_id}>{series.series_name}</option>)}
            </select>
         </>
         :
        null}

        {/* Parent Series (for bts movies) */}
        {type === 'bts_movies' ? 
         <>
            <p>Belongs to which Movie?</p>
            <select value = {parentID} onChange = {(e) => setParentID(e.target.value)}>
                {allContent.movie.map((movie) => <option key = {movie.movie_id} value = {movie.movie_id}>{movie.movie_name}</option>)}
            </select>
         </>
         :
        null}

        {/* Podcast Type */}
        {type === 'podcast' ? 
        <>
            <p>Podcast Type</p>
            <select value={inputValues.podcast_type} onChange={(e) => handleChange(e, 'podcast_type')}>
                <option value='highlight'>Highlight</option>
                <option value='interview'>Interview</option>
                <option value='review'>Review</option>
             </select>
        </>
        :
        null}

        {/* Date */}
        <p>Date Created</p>
        <input 
            type="date" 
            value={inputValues.date} 
            onChange={(e) => handleChange(e, 'date')} 
         />

         {/* Description */}
         <p>Description</p>
         <input className='editing_input-small' value = {inputValues.main} onChange = {(e) => handleChange(e, 'main')}></input>

         { /* Directors, Starring, Producers */}
         {type !== 'video' && type !== 'bts_series' && type !== 'bts_movies' ?
         <>
         <p>Directors</p>
         <input className='editing_input-small' value = {inputValues.directors} onChange = {(e) => handleChange(e, 'directors')}></input>
         <p>Starring</p>
         <input className='editing_input-small' value = {inputValues.starring} onChange = {(e) => handleChange(e, 'starring')}></input>
         <p>Producers</p>
         <input className='editing_input-small' value = {inputValues.producers} onChange = {(e) => handleChange(e, 'producers')}></input>
         </>
         : null}

         {/* Country */}
         {type === 'series' || type === 'movie' || type === 'podcast' ? 
         <>
         <p>Country of Origin</p>
         <select value = {countryID} onChange = {(e) => setCountryID(e.target.value)}>
            {allContent.countries.map((country) => <option key = {country.country_id} value = {country.country_id}>{country.country_name}</option>)}
         </select>
         </>
         :
         null}
        
        {/* Genres */}
        {type === 'series' || type === 'movie' ? 
        <>
         <p>Genre(s)</p>
         <select value = "placeholderValue" onChange = {handleGenreChange}>
            <option disabled value = "placeholderValue">Select Genres</option>
            {allContent.genres.map((genre) => <option key={genre.genre_id} value={genre.genre_id}>{genre.genre_name}</option>)}
         </select>
         {/* Rendering of Selected Genres */}
         <p>Selected Genres</p>
         {genres.length === 0 ? <p>None</p> : null}
         <div className='genres'>
            {genres.map((genre) => <p key = {genre.genre_id} onClick={() => handleRemoveGenre(genre.genre_id.toString())} style = {{cursor: 'pointer'}}>{genre.genre_name}</p>)}
         </div>
         </>
         : 
         null}

        {/* Season */}
        {type === 'video' ? 
         <>
            <p>Season</p>
            <input className='editing_input-small' value = {inputValues.season} onChange = {(e) => handleChange(e, 'season')}></input>
         </>
         :
        null}

        {/* Episode */}
        {type !== 'series' && type !== 'movie' ? 
         <>
            <p>Episode</p>
            <input className='editing_input-small' value = {inputValues.episode} onChange = {(e) => handleChange(e, 'episode')}></input>
         </>
         :
        null}

        {/* Length */}
        {type !== 'series' ? 
         <>
            <p>Length of content (in minutes)</p>
            <input className='editing_input-small' value = {inputValues.length} onChange = {(e) => handleChange(e, 'length')}></input>
         </>
         :
        null}
        {/* Thumbnail and Hero */}
        <div className='active-wrapper'>
            <>
            <p>Choose thumbnail (webp) - 250x150</p>
            <input type = 'file' className = "img-upload" disabled = {inputValues.name ? false : true} accept = "image/webp" onChange = {(e) => updateUploadFiles(e, 'thumbnail')}></input>
            </>
        {type !== 'video' && type !== 'bts_series' && type !== 'bts_movies' ?
            <>
            <p>Choose hero image (webp)</p>
            <input type = 'file' className = "img-upload" disabled = {inputValues.name ? false : true} accept = "image/webp" onChange = {(e) => updateUploadFiles(e, 'hero')}></input>
        </>:null
        } 
        {/* Content Source. Can't add to Series because Series is a container for its video content. If a new series is made, a directory within the S3 is made under videos/content/series_name*/}
        {type !== 'series' ? 
            <>
            <p>Choose content to upload - mp4</p>
            <input type = 'file' className='img-upload' disabled = {inputValues.name ? false : true} accept = "video/mp4" 
            onChange = {(e) => updateUploadFiles(e, 'content')}>
            </input>
            </>
        :null}
        </div>
        <br/>
         <button className='active-finish' type = "submit">Create Media</button>
        </form>
        : 
        null}
    </div>
  )
}

export default AddPanel