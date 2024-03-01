import {useState, useEffect} from 'react'
import axios from "axios";

const convertDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const readableDate = dateObj.toLocaleDateString('en-US', options);
    return readableDate;
}

//There are several IF statement blocks that have similar markup. They exist as conditional rendering depending on the type of properties being passed.
//In this case, the type of content that ADMIN is editing (i.e. Series, Videos, Movies, Podcasts, BTS)

const Active = ({type, details, countries}) => {
    // console.log(details);
    // console.log(countries);

    if (type === 'series') {

        const {series_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({});
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        const handleChangedData = async (e) => {
            e.preventDefault()
            // console.log(inputValues);
            try {
                const res = await axios.post(`http://localhost:3001/api/user/adminUpdate/${type}`, inputValues)
            }
            catch (err) {
                if (err.response) {
                  console.error(err.response.data.message); 
                }
                console.error(err + ': Error attempting to log in');
              }
        }

        // const handleCountryChange = (e) => {
        //     console.log(inputValues);
        //     setInputValues({...inputValues, series_country: [{country_id:e.target.value}]})
        // }

        return (
            <form className='active-wrapper' onSubmit = {(e) => handleChangedData(e)}>
                <p className='active-description'>(Cannot Change) Series ID: <span className='active-primary'>{series_id}</span></p>
                {/* Name */}
                <p className='active-description'>Series Name: {isEditing.series_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_name}
                                onChange={(e) => handleChange(e, 'series_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_name}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Status */}
                <p className='active-description'>Series Status: </p> 
                    <select value = {inputValues.series_status} onChange = {(e) => handleChange(e, 'series_status')}>
                        <option value = 'pre'>Pre-Production</option>
                        <option value = 'post'>Production</option>
                        <option value = 'prod'>Post-Production</option>
                    </select>
                {/* Completed? */}
                <p className='active-description'>Is Series Completed?: </p> 
                    <select value = {inputValues.completed} onChange = {(e) => handleChange(e, 'completed')}>
                        <option value = 'true'>Yes</option>
                        <option value = 'false'>No</option>
                    </select>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' type = "button" onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' type = "button" onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                {/* Country of Origin */}
                {/* <p className='active-description'>Country: {isEditing.series_country ? (
                    <>
                        <select value = {inputValues.series_country[0].country.country_id} onChange = {(e) => handleCountryChange(e)}>
                            {countries.map((country) => <option key = {country.country_id} value = {country.country_id}>{country.country_id}:{country.country_name}</option>)}
                        </select>
                        <button className='active-save' onClick={() => handleSave('series_country')}>Save</button>
                    </>
                )
                :
                (
                    <>
                    <span className='active-primary'>{inputValues.series_country[0].country.country_name}</span>
                    <button className='active-edit' onClick={() => handleEdit('series_country')}>Edit</button>
                    </>
                )
            }</p> */}
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.series_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.series_main}
                                onChange={(e) => handleChange(e, 'series_main')}
                                className='editing_input'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_main}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_main')}>Edit</button>
                        </>
                    )}</p>
                    {/* Directors */}
                    <p className='active-description'>Directors: {isEditing.series_directors ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_directors}
                                onChange={(e) => handleChange(e, 'series_directors')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_directors')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_directors}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_directors')}>Edit</button>
                        </>
                    )}</p>
                    {/* Starring */}
                    <p className='active-description'>Starring: {isEditing.series_starring ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_starring}
                                onChange={(e) => handleChange(e, 'series_starring')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_starring')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_starring}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_starring')}>Edit</button>
                        </>
                    )}</p>
                    {/* Producers */}
                    <p className='active-description'>Producers: {isEditing.series_producers ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_producers}
                                onChange={(e) => handleChange(e, 'series_producers')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_producers')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_producers}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_producers')}>Edit</button>
                        </>
                    )}</p>
                    {/* Upvotes */}
                    <p className='active-description'>Upvotes: {isEditing.series_upvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_upvotes}
                                onChange={(e) => handleChange(e, 'series_upvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_upvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_upvotes}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_upvotes')}>Edit</button>
                        </>
                    )}</p>
                    {/* Downvotes */}
                    <p className='active-description'>Downvotes: {isEditing.series_downvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_downvotes}
                                onChange={(e) => handleChange(e, 'series_downvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' type = "button" onClick={() => handleSave('series_downvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_downvotes}</span>
                            <button className='active-edit' type = "button" onClick={() => handleEdit('series_downvotes')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish' type = "submit">Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button type = "button" onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' type = "button" onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </form>
        )
    }
    if (type === 'video') {

        const {video_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ });
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        return (
            <div className='active-wrapper'>
                <p className='active-description'>(Cannot Change) Video ID: <span className='active-primary'>{video_id}</span></p>
                {/* Name */}
                <p className='active-description'>Series Name: {isEditing.video_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.series_name}
                                onChange={(e) => handleChange(e, 'video_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('video_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.video_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('video_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                
                
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.video_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.video_main}
                                onChange={(e) => handleChange(e, 'video_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('video_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.video_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('video_main')}>Edit</button>
                        </>
                    )}</p>
                    {/* Season */}
                    <p className='active-description'>Season: {isEditing.video_season ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.video_season}
                                onChange={(e) => handleChange(e, 'video_season')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('video_season')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.video_season}</span>
                            <button className='active-edit' onClick={() => handleEdit('video_season')}>Edit</button>
                        </>
                    )}</p>
                    {/* Episode */}
                    <p className='active-description'>Episode: {isEditing.video_episode ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.video_episode}
                                onChange={(e) => handleChange(e, 'video_episode')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('video_episode')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.video_episode}</span>
                            <button className='active-edit' onClick={() => handleEdit('video_episode')}>Edit</button>
                        </>
                    )}</p>
                    {/* Length of Video */}
                    <p className='active-description'>Length (in minutes): {isEditing.video_length ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.video_length}
                                onChange={(e) => handleChange(e, 'video_length')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('video_length')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.video_length}</span>
                            <button className='active-edit' onClick={() => handleEdit('video_length')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish'>Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </div>
        )
    }
    if (type === 'movie') {

        const {movie_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ });
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        return (
            <div className='active-wrapper'>
                <p className='active-description'>(Cannot Change) Movie ID: <span className='active-primary'>{movie_id}</span></p>
                {/* Name */}
                <p className='active-description'>Series Name: {isEditing.movie_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_name}
                                onChange={(e) => handleChange(e, 'movie_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Status */}
                <p className='active-description'>Movie Status: </p> 
                    <select value = {inputValues.movie_status} onChange = {(e) => handleChange(e, 'movie_status')}>
                        <option value = 'pre'>Pre-Production</option>
                        <option value = 'post'>Production</option>
                        <option value = 'prod'>Post-Production</option>
                    </select>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                 {/* Length of Movie */}
                 <p className='active-description'>Length (in minutes): {isEditing.movie_length ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_length}
                                onChange={(e) => handleChange(e, 'movie_length')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_length')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_length}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_length')}>Edit</button>
                        </>
                    )}</p>
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.movie_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.movie_main}
                                onChange={(e) => handleChange(e, 'movie_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_main')}>Edit</button>
                        </>
                    )}</p>
                    {/* Directors */}
                    <p className='active-description'>Directors: {isEditing.movie_directors ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_directors}
                                onChange={(e) => handleChange(e, 'movie_directors')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_directors')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_directors}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_directors')}>Edit</button>
                        </>
                    )}</p>
                    {/* Starring */}
                    <p className='active-description'>Starring: {isEditing.movie_starring ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_starring}
                                onChange={(e) => handleChange(e, 'movie_starring')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_starring')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_starring}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_starring')}>Edit</button>
                        </>
                    )}</p>
                    {/* Producers */}
                    <p className='active-description'>Producers: {isEditing.movie_producers ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_producers}
                                onChange={(e) => handleChange(e, 'movie_producers')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_producers')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_producers}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_producers')}>Edit</button>
                        </>
                    )}</p>
                    {/* Upvotes */}
                    <p className='active-description'>Upvotes: {isEditing.movie_upvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_upvotes}
                                onChange={(e) => handleChange(e, 'movie_upvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_upvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_upvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_upvotes')}>Edit</button>
                        </>
                    )}</p>
                    {/* Downvotes */}
                    <p className='active-description'>Downvotes: {isEditing.movie_downvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.movie_downvotes}
                                onChange={(e) => handleChange(e, 'movie_downvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('movie_downvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.movie_downvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('movie_downvotes')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish'>Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </div>
        )
    }
    if (type === 'podcast') {

        const {podcast_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ });
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        return (
            <div className='active-wrapper'>
                <p className='active-description'>(Cannot Change) Podcast ID: <span className='active-primary'>{podcast_id}</span></p>
                {/* Name */}
                <p className='active-description'>Podcast Name: {isEditing.podcast_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_name}
                                onChange={(e) => handleChange(e, 'podcast_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Status */}
                <p className='active-description'>Podcast Type: </p> 
                    <select value = {inputValues.podcast_type} onChange = {(e) => handleChange(e, 'podcast_type')}>
                        <option value = 'interview'>Interview</option>
                        <option value = 'highlight'>Highlight</option>
                        <option value = 'review'>Review</option>
                    </select>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                 {/* Podcast Episode */}
                 <p className='active-description'>Episode: {isEditing.podcast_episode ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_episode}
                                onChange={(e) => handleChange(e, 'podcast_episode')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_episode')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_episode}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_episode')}>Edit</button>
                        </>
                    )}</p>
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.podcast_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.podcast_main}
                                onChange={(e) => handleChange(e, 'podcast_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_main')}>Edit</button>
                        </>
                    )}</p>
                    {/* Directors */}
                    <p className='active-description'>Directors: {isEditing.podcast_directors ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_directors}
                                onChange={(e) => handleChange(e, 'podcast_directors')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_directors')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_directors}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_directors')}>Edit</button>
                        </>
                    )}</p>
                    {/* Starring */}
                    <p className='active-description'>Starring: {isEditing.podcast_starring ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_starring}
                                onChange={(e) => handleChange(e, 'podcast_starring')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_starring')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_starring}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_starring')}>Edit</button>
                        </>
                    )}</p>
                    {/* Producers */}
                    <p className='active-description'>Producers: {isEditing.podcast_producers ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_producers}
                                onChange={(e) => handleChange(e, 'podcast_producers')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_producers')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_producers}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_producers')}>Edit</button>
                        </>
                    )}</p>
                    {/* Upvotes */}
                    <p className='active-description'>Upvotes: {isEditing.podcast_upvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_upvotes}
                                onChange={(e) => handleChange(e, 'podcast_upvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_upvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_upvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_upvotes')}>Edit</button>
                        </>
                    )}</p>
                    {/* Downvotes */}
                    <p className='active-description'>Downvotes: {isEditing.podcast_downvotes ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.podcast_downvotes}
                                onChange={(e) => handleChange(e, 'podcast_downvotes')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('podcast_downvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.podcast_downvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('podcast_downvotes')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish'>Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </div>
        )
    }
    if (type === 'bts_series') {

        const {bts_series_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ });
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        return (
            <div className='active-wrapper'>
                <p className='active-description'>(Cannot Change) BTS Series ID: <span className='active-primary'>{bts_series_id}</span></p>
                {/* Name */}
                <p className='active-description'>BTS Series Name: {isEditing.bts_series_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_series_name}
                                onChange={(e) => handleChange(e, 'bts_series_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_series_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_series_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_series_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                 {/* BTS Episode */}
                 <p className='active-description'>Episode: {isEditing.bts_series_episode ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_series_episode}
                                onChange={(e) => handleChange(e, 'bts_series_episode')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_series_episode')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_series_episode}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_series_episode')}>Edit</button>
                        </>
                    )}</p>
                    {/* Length of Video */}
                    <p className='active-description'>Length (in minutes): {isEditing.bts_series_length ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_series_length}
                                onChange={(e) => handleChange(e, 'bts_series_length')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_series_length')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_series_length}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_series_length')}>Edit</button>
                        </>
                    )}</p>
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.bts_series_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.bts_series_main}
                                onChange={(e) => handleChange(e, 'bts_series_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_series_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_series_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_series_main')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish'>Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </div>
        )
    }
    if (type === 'bts_movies') {

        const {bts_movies_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ });
        const [toggleDelete, setToggleDelete] = useState(false)

        useEffect(() => {
            setInputValues(details);
        }, [details]);

        const handleEdit = (field) => {
            setIsEditing({ ...isEditing, [field]: true });
        };

        const handleChange = (e, field) => {
            setInputValues({ ...inputValues, [field]: e.target.value });
        };

        const handleSave = (field) => {
            setIsEditing({ ...isEditing, [field]: false });
        };

        return (
            <div className='active-wrapper'>
                <p className='active-description'>(Cannot Change) BTS Series ID: <span className='active-primary'>{bts_movies_id}</span></p>
                {/* Name */}
                <p className='active-description'>BTS Series Name: {isEditing.bts_movies_name ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_movies_name}
                                onChange={(e) => handleChange(e, 'bts_movies_name')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_movies_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_movies_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_movies_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Date */}
                <p className='active-description'>Date Created: {isEditing.date_created ? (
                    <>
                        <input 
                            type="date" 
                            value={inputValues.date_created.split('T')[0]} //takes iso stirng into more readable format
                            onChange={(e) => handleChange(e, 'date_created')} 
                        />
                         <button className='active-save' onClick={() => handleSave('date_created')}>Save</button>
                    </>
                    )
                    :
                    (
                    <>
                      <span className='active-primary'>{convertDate(inputValues.date_created)}</span>
                      <button className='active-edit' onClick={() => handleEdit('date_created')}>Edit</button>
                    </>
                    )}</p>
                 {/* BTS Episode */}
                 <p className='active-description'>Episode: {isEditing.bts_movies_episode ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_movies_episode}
                                onChange={(e) => handleChange(e, 'bts_movies_episode')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_movies_episode')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_movies_episode}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_movies_episode')}>Edit</button>
                        </>
                    )}</p>
                    {/* Length of Video */}
                    <p className='active-description'>Length (in minutes): {isEditing.bts_movies_length ? (
                        <>
                            <input 
                                type="text" 
                                value={inputValues.bts_movies_length}
                                onChange={(e) => handleChange(e, 'bts_movies_length')}
                                className='editing_input-small'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_movies_length')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_movies_length}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_movies_length')}>Edit</button>
                        </>
                    )}</p>
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.bts_movies_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.bts_movies_main}
                                onChange={(e) => handleChange(e, 'bts_movies_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('bts_movies_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.bts_movies_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('bts_movies_main')}>Edit</button>
                        </>
                    )}</p>
                    <div className='active-bottom'>
                    <button className='active-finish'>Save Changes</button>
                    {toggleDelete ? <div>
                    <p>Are you sure?</p>
                    <button onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                    <br/>
                    <button className='active-delete'>Delete Content</button>
                    </div>:<button className='active-delete' onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                    </div>
                    
            </div>
        )
    }
}

export default Active