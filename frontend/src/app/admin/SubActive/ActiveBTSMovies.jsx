import {useState, useEffect} from 'react'

const ActiveBTSMovies = ({details, convertDate, upload, deleteContent}) => {
    const {bts_movies_id} = details
    const [uploadProgress, setUploadProgress] = useState(0);

    const [inputValues, setInputValues] = useState(details);
    const [assetChange, setAssetChange] = useState({thumbnail: false, hero: false, content: false})
    const [assetValue, setAssetValue] = useState({thumbnail: details.bts_movies_thumbnail, content: details.bts_movies_url})
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
            <p className='active-description'>(Cannot Change) BTS Movies ID: <span className='active-primary'>{bts_movies_id}</span></p>
            {/* Name */}
            <p className='active-description'>BTS Movie Name: {isEditing.bts_movies_name ? (
                    <>
                        <input 
                            type="text" 
                            value={inputValues.bts_movies_name}
                            onChange={(e) => handleChange(e, 'bts_movies_name')}
                            className='editing_input-small'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('bts_movies_name')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.bts_movies_name}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('bts_movies_name')}>Edit</button>
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
                    <img src = {inputValues.bts_movies_thumbnail} className='active-image' alt = "thumbnail"></img>
                    <label>Current Thumbnail</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'thumbnail')} accept = "image/webp"></input>
                </div>
                <br/>
                <div className='active-images-inner'>
                    <label>Change BTS Movie Source</label>
                    <input type = "file" onChange = {(e) => handleImageChange(e, 'content')} accept = "video/mp4"></input>
                    <video controls style = {{width: '15rem'}}><source src= {inputValues.bts_movies_url}></source></video>
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
            
             {/* BTS Episode */}
             <p className='active-description'>Episode: {isEditing.bts_movies_episode ? (
                    <>
                        <input 
                            type="text" 
                            value={inputValues.bts_movies_episode}
                            onChange={(e) => handleChange(e, 'bts_movies_episode')}
                            className='editing_input-small'
                        />
                        <button className='active-save' type = "button" onClick={() => handleSave('bts_movies_episode')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.bts_movies_episode}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('bts_movies_episode')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('bts_movies_length')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.bts_movies_length}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('bts_movies_length')}>Edit</button>
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
                        <button className='active-save' type = "button" onClick={() => handleSave('bts_movies_main')}>Save</button>
                    </>
                ) : (
                    <>
                        <span className='active-primary'>{inputValues.bts_movies_main}</span>
                        <button className='active-edit' type = "button" onClick={() => handleEdit('bts_movies_main')}>Edit</button>
                    </>
                )}</p>
                <div className='active-bottom'>
                <button className='active-finish' type ="submit" >Save Changes</button>
                {toggleDelete ? <div>
                <p>Are you sure?</p>
                <button type = "button" onClick = {() => setToggleDelete(false)} className='active-finish'>Go Back</button>
                <br/>
                <button type = "button" className='active-delete'>Delete Content</button>
                </div>:<button className='active-delete' type = "button" onClick = {() => setToggleDelete(true)}>Delete Content</button>}
                </div>
                
        </form>
    )
}

export default ActiveBTSMovies