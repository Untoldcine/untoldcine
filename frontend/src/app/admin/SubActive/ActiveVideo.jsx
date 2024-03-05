import {useState, useEffect} from 'react'

const ActiveVideo = ({details, convertDate, upload, deleteContent}) => {
    const {video_id} = details

    const [inputValues, setInputValues] = useState(details);
    const [assetChange, setAssetChange] = useState({thumbnail: false, hero: false, content: false})
    const [assetValue, setAssetValue] = useState({thumbnail: details.video_thumbnail, content: details.video_url})
    const [isEditing, setIsEditing] = useState({});
    const [toggleDelete, setToggleDelete] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0);


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
            <p className='active-description'>(Cannot Change) Video ID: <span className='active-primary'>{video_id}</span></p>
            {/* Name */}
            <p className='active-description'>Video Name: {isEditing.video_name ? (
                    <>
                        <input 
                            type="text" 
                            value={inputValues.video_name}
                            onChange={(e) => handleChange(e, 'video_name')}
                            className='editing_input-small'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('video_name')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.video_name}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('video_name')}>Edit</button>
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
                    <img src = {inputValues.video_thumbnail} className='active-image' alt = "thumbnail"></img>
                    <label>Current Thumbnail</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'thumbnail')} accept = "image/webp"></input>
                </div>
                <br/>
                <div className='active-images-inner'>
                    <label>Change Video Source</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'content')} accept = "video/mp4"></input>
                    <video controls style = {{width: '15rem'}}><source src= {inputValues.video_url}></source></video>
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
            
            {/* Main Description */}
            <p className='active-description'>Description: {isEditing.video_main ? (
                    <>
                        <input 
                            type="textarea" 
                            value={inputValues.video_main}
                            onChange={(e) => handleChange(e, 'video_main')}
                            className='editing_input'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('video_main')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.video_main}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('video_main')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('video_season')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.video_season}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('video_season')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('video_episode')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.video_episode}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('video_episode')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('video_length')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.video_length}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('video_length')}>Edit</button>
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

export default ActiveVideo