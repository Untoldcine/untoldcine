import {useState, useEffect} from 'react'

const convertDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const readableDate = dateObj.toLocaleDateString('en-US', options);
    return readableDate;
}

const Active = ({type, details}) => {
    // console.log(details);

    if (type === 'series') {

        const {series_id} = details

        const [inputValues, setInputValues] = useState(details);
        const [isEditing, setIsEditing] = useState({ series_name: false });
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
                            <button className='active-save' onClick={() => handleSave('series_name')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_name}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_name')}>Edit</button>
                        </>
                    )}</p>
                {/* Status */}
                <p className='active-description'>Series Status: </p> 
                    <select value = {inputValues.series_status} onChange = {(e) => handleChange(e, 'series_status')}>
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
                
                
                {/* Main Description */}
                <p className='active-description'>Description: {isEditing.series_main ? (
                        <>
                            <input 
                                type="textarea" 
                                value={inputValues.series_main}
                                onChange={(e) => handleChange(e, 'series_main')}
                                className='editing_input'
                            />
                            <button className='active-save' onClick={() => handleSave('series_main')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_main}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_main')}>Edit</button>
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
                            <button className='active-save' onClick={() => handleSave('series_directors')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_directors}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_directors')}>Edit</button>
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
                            <button className='active-save' onClick={() => handleSave('series_starring')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_starring}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_starring')}>Edit</button>
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
                            <button className='active-save' onClick={() => handleSave('series_producers')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_producers}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_producers')}>Edit</button>
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
                            <button className='active-save' onClick={() => handleSave('series_upvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_upvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_upvotes')}>Edit</button>
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
                            <button className='active-save' onClick={() => handleSave('series_downvotes')}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className='active-primary'>{inputValues.series_downvotes}</span>
                            <button className='active-edit' onClick={() => handleEdit('series_downvotes')}>Edit</button>
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

  return (
    <div className=''>
    </div>
  )
}

export default Active