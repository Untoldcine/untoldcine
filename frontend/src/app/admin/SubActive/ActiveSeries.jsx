import {useState, useEffect} from 'react'


const ActiveSeries = ({details, convertDate, upload, deleteContent}) => {
        const {series_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [assetChange, setAssetChange] = useState({thumbnail: false, hero: false})
        const [assetValue, setAssetValue] = useState({thumbnail: details.series_thumbnail, hero: details.series_hero})
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
                {/* Thumbnail/Heros */}
                <div className='active-images-box'>
                    <div className='active-images-inner'>
                        <img src = {inputValues.series_thumbnail} className='active-image' alt = "thumbnail"></img>
                        <label>Current Thumbnail</label>
                        <input type = "file" onChange = {(e) => handleImageChange(e, 'thumbnail')} accept = "image/webp"></input>
                    </div>
                    <div className='active-images-inner'>
                        <img src = {inputValues.series_hero} className='active-image' alt = "Hero Image"></img>
                        <label>Current Hero</label>
                        <input type = "file" onChange = {(e) => handleImageChange(e, 'hero')} accept = "image/webp"></input>
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
                    <button className='active-delete' type = "button" onClick = {(e) => handleDeleteData(e, type, details.series_id)} >Delete Content</button>
                    </div>:<button className='active-delete' type = "button" onClick = {() => setToggleDelete(true)}>Toggle Delete</button>}
                    </div>
                    
            </form>
        )
}

export default ActiveSeries