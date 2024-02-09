//right now being used for Comments
export function convertTime(date) {
  const now = Date.now();
  const commentDate = new Date(date).getTime();
  const differenceInSeconds = Math.round((now - commentDate) / 1000);

  if (differenceInSeconds < 60) {
    return "Just now";
  } else if (differenceInSeconds < 120) {
    return "1 minute ago";
  } else if (differenceInSeconds < 3600) {
    return `${Math.floor(differenceInSeconds / 60)} minutes ago`;
  } else if (differenceInSeconds < 7200) {
    return `1 hour ago`;
  } else if (differenceInSeconds < 86400) {
    return `${Math.floor(differenceInSeconds / 3600)} hours ago`;
  } else if (differenceInSeconds < 172800) {
    return `1 day ago`;
  } else if (differenceInSeconds < 2592000) {
    return `${Math.floor(differenceInSeconds / 86400)} days ago`;
  } else if (differenceInSeconds < 5256000) {
    return `1 month ago`;
  } else if (differenceInSeconds < 31536000) {
    return `${Math.floor(differenceInSeconds / 2592000)} months ago`;
  } else if (differenceInSeconds < 63072000) {
    return `1 year ago`;
  } else {
    return `${Math.floor(differenceInSeconds / 31536000)} years ago`;
  }
}

export function calculateRating(up, down) {
  return `${up - down} rating`;
}
