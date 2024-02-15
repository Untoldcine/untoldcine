export interface SeriesSummary {
    series_id: number
    series_name: string
    series_status: string
    genres: string[]
    series_thumbnail: string | null
    series_length: number,
    reviewed: boolean 
}

export interface MovieSummary {
    movie_id: number
    movie_name: string
    movie_status: string
    genres: string[]
    movie_length: number
    movie_thumbnail: string | null
    reviewed: boolean 

}

export interface PodcastSummary {
    podcast_id: number
    podcast_name: string
    podcast_status: string
    podcast_thumbnail: string | null
    reviewed: boolean 

}


export interface BTSSeriesSummary {
    series_id: number
    bts_series_id: number
    series_name: string
    series_status: string
    series_thumbnail: string | null
}
export interface BTSMoviesSummary {
    movie_id: number
    bts_movies_id: number
    movie_name: string
    movie_status: string
    movie_thumbnail: string | null
}

export interface User {
    user_id: number
    user_nickname: string
    user_password: string
    user_email: string
    user_level: number
    free_tier: boolean
    free_tier_expiry: string | null
    pw_reset_token: string | null
    reset_token_expiry: string | null
    created_at: string
    deleted: boolean | null
    deleted_at: string | null
}

export interface SeriesComment {
    series_comments_id: number
    series_comments_content: string
    user_id: number
    user: User
    series_comments_upvotes: number
    series_comments_downvotes: number
    parent_series_id: number
    parent_comment_id: number | null
    date_created: string
    edited: boolean
    deleted: boolean
    deleted_at: string | null
    replies: SeriesComment[] | []
}

export interface MovieComment {
    movie_comments_id: number
    movie_comments_content: string
    user_id: number
    user: User
    movie_comments_upvotes: number
    movie_comments_downvotes: number
    parent_movie_id: number
    parent_comment_id: number | null
    date_created: string
    edited: boolean
    deleted: boolean
    deleted_at: string | null
    replies: MovieComment[] | []
}

export interface PodcastComment {
    podcast_comments_id: number
    podcast_comments_content: string
    user_id: number
    user: User
    podcast_comments_upvotes: number
    podcast_comments_downvotes: number
    parent_podcast_id: number
    parent_comment_id: number | null
    date_created: string
    edited: boolean
    deleted: boolean
    deleted_at: string | null
    replies: PodcastComment[] | []
}
