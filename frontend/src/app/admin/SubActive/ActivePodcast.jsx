import {useState, useEffect} from 'react'

const ActivePodcast = ({details, convertDate, upload, deleteContent}) => {
  
    const {podcast_id} = details
    const [uploadProgress, setUploadProgress] = useState(0);

    const [inputValues, setInputValues] = useState(details);
    const [assetChange, setAssetChange] = useState({thumbnail: false, hero: false, content: false})
    const [assetValue, setAssetValue] = useState({thumbnail: details.podcast_thumbnail, hero: details.podcast_hero, content: details.podcast_url})
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_name')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_name}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_name')}>Edit</button>
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
                    <img src = {inputValues.podcast_thumbnail} className='active-image' alt = "thumbnail"></img>
                    <label>Current Thumbnail</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'thumbnail')} accept = "image/webp"></input>
                </div>
                <div className='active-images-inner'>
                    <img src = {inputValues.podcast_hero} className='active-image' alt = "hero"></img>
                    <label>Current Hero</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'hero')} accept = "image/webp"></input>
                </div>
                <br/>
                <div className='active-images-inner'>
                    <label>Change Podcast Source</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'content')} accept = "video/mp4"></input>
                    <video controls style = {{width: '15rem'}}><source src= {inputValues.podcast_url}></source></video>
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

             {/* Podcast Episode */}
             <p className='active-description'>Episode: {isEditing.podcast_episode ? (
                    <>
                        <input 
                            type="text" 
                            value={inputValues.podcast_episode}
                            onChange={(e) => handleChange(e, 'podcast_episode')}
                            className='editing_input-small'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_episode')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_episode}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_episode')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_main')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_main}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_main')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_directors')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_directors}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_directors')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_starring')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_starring}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_starring')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_producers')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_producers}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_producers')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_upvotes')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_upvotes}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_upvotes')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('podcast_downvotes')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.podcast_downvotes}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('podcast_downvotes')}>Edit</button>
                    </>
                )}</p>
                <div className='active-bottom'>
                <button className='active-finish' type = "submit">Save Changes</button>
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

export default ActivePodcast