//right now being used for Comments
export function convertTime(date) {
    const now = Date.now(); 
    const commentDate = new Date(date).getTime(); 
    const differenceInSeconds = Math.round((now - commentDate) / 1000); 

    // Calculate time ago
    if (differenceInSeconds < 60) {
        return 'Just now';
    } else if (differenceInSeconds < 3600) { // Less than an hour
        return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
    } else if (differenceInSeconds < 86400) { // Less than a day
        return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
    } else if (differenceInSeconds < 2592000) { // Less than a month
        return `${Math.floor(differenceInSeconds / 86400)} days ago`;
    } else if (differenceInSeconds < 31536000) { // Less than a year
        return `${Math.floor(differenceInSeconds / 2592000)} months ago`;
    } else { // More than a year
        return `${Math.floor(differenceInSeconds / 31536000)} years ago`;
    }
}


export function calculateRating(up, down) {
    return `${up - down} rating`
}