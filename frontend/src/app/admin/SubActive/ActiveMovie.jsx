import {useState, useEffect} from 'react'

const ActiveMovie = ({details, convertDate, upload, deleteContent}) => {
    const {movie_id} = details
    const [uploadProgress, setUploadProgress] = useState(0);

    const [inputValues, setInputValues] = useState(details);
    const [assetChange, setAssetChange] = useState({thumbnail: false, hero: false, content: false})
    const [assetValue, setAssetValue] = useState({thumbnail: details.movie_thumbnail, hero: details.movie_hero, content: details.movie_url})
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

    const handleImageChange = async (e, field) => {
        const file = e.target.files[0]
        setAssetChange({...assetChange, [field]:true})
        setAssetValue({...assetValue, [field]: file})
    }

    return (
        <form className='active-wrapper' onSubmit = {(e) => upload(e, type, details, inputValues, assetChange, assetValue, setUploadProgress)}>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_name')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_name}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_name')}>Edit</button>
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

                {/* Thumbnail/Heros/Content*/}
            <div className='active-images-box'>
                <div className='active-images-inner'>
                    <img src = {inputValues.movie_thumbnail} className='active-image' alt = "thumbnail"></img>
                    <label>Current Thumbnail</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'thumbnail')} accept = "image/webp"></input>
                </div>
                <div className='active-images-inner'>
                    <img src = {inputValues.movie_hero} className='active-image' alt = "hero"></img>
                    <label>Current Hero</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'hero')} accept = "image/webp"></input>
                </div>
                <br/>
                <div className='active-images-inner'>
                    <label>Change Movie Source</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'content')} accept = "video/mp4"></input>
                    <video controls style = {{width: '15rem'}}><source src= {inputValues.movie_url}></source></video>
                </div>
                <div className='active-images-inner'>
                    <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` , color: 'white'}}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >{uploadProgress}%</div>
                    </div>
                </div>
            </div>
             {/* Length of Movie */}
             <p className='active-description'>Length (in minutes): {isEditing.movie_length ? (
                    <>
                        <input 
                            type="text" 
                            value={inputValues.movie_length}
                            onChange={(e) => handleChange(e, 'movie_length')}
                            className='editing_input-small'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_length')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_length}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_length')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_main')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_main}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_main')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_directors')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_directors}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_directors')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_starring')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_starring}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_starring')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_producers')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_producers}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_producers')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_upvotes')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_upvotes}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_upvotes')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('movie_downvotes')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.movie_downvotes}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('movie_downvotes')}>Edit</button>
                    </>
                )}</p>
                <div className='active-bottom'>
                <button className='active-finish' type = 'submit'>Save Changes</button>
                {toggleDelete ? <div>
                <p>Are you sure?</p>
                <button type = "button" onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                <br/>
                <button className='active-delete' type = "button" >Delete Content</button>
                </div>:<button className='active-delete' type = "button" onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                </div>
                
        </form>
    )
}

export default ActiveMovie