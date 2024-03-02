import {useState, useEffect} from 'react'

const AddPanel = ({allContent}) => {
    console.log(allContent);

    const [type, setType] = useState('none')
    const [inputValues, setInputValues] = useState({name: '', status: 'pre', podcast_type: 'highlight', date: '', main: '', directors: '', starring: '', producers: '', length: '', season: '', episode: ''})
    const [parentID, setParentID] = useState()
    const [countryID, setCountryID] = useState(1)
    const [genres, setGenres] = useState([])
    
    const handleChange = (e, field) => {
        setInputValues({ ...inputValues, [field]: e.target.value });
    };

    //prevents duplication of genres
    const handleGenreChange = (e) => {
        const selectedGenre = e.target.value;
        if (!genres.includes(selectedGenre) && selectedGenre !== "placeholderValue") {
            setGenres([...genres, selectedGenre]);
        }
    };

    const handleRemoveGenre = (genreToRemove) => {
        setGenres(genres.filter(genre => genre !== genreToRemove));
    };

    useEffect(() => {
        if (type === 'video' && allContent.series && allContent.series.length > 0) {
            setParentID(allContent.series[0].series_id);
        }
    }, [type, allContent.series]);
    
    // console.log('parentID' + parentID);
    console.log(genres);

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
        <form>
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
         <p>Country of Origin</p>
         <select value = {countryID} onChange = {(e) => setCountryID(e.target.value)}>
            {allContent.countries.map((country) => <option key = {country.country_id} value = {country.country_id}>{country.country_name}</option>)}
         </select>
         {/* Genres */}
         <p>Genre(s)</p>
         <select value = "placeholderValue" onChange = {handleGenreChange}>
            <option disabled value = "placeholderValue">Select Genres</option>
            {allContent.genres.map((genre) => <option key = {genre.genre_id} value = {genre.genre_name}>{genre.genre_name}</option>)}
         </select>
         {/* Rendering of Selected Genres */}
         <p>Selected Genres</p>
         {genres.length === 0 ? <p>None</p> : null}
         <div className='genres'>
            {genres.map((genre) => <p key = {genre} onClick={() => handleRemoveGenre(genre)} style = {{cursor: 'pointer'}}>{genre}</p>)}
         </div>
         {/* Parent Series (for video & bts series) */}
         {type === 'video' || type === 'bts_series' ? 
         <>
            <p>Belongs to which Series?</p>
            <select value = {parentID} onChange = {(e) => setParentID(e.target.value)}>
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
        {/* Season */}
        {type === 'video' ? 
         <>
            <p>Season</p>
            <input className='editing_input-small' value = {inputValues.season} onChange = {(e) => handleChange(e, 'season')}></input>
         </>
         :
        null}
        {/* Episode */}
        {type === 'video' && type === 'podcast' ? 
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
        
        </form>
        : 
        null}
    </div>
  )
}

export default AddPanel