import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import {
  loadingTweets,
  loadingTweetsFailed,
  receivedTweets,
} from '../actions'

const getID = tweet => tweet.id
const getTweet = state => id => state.byId[ id ]

export const getLoadingFromState = state =>
  state.isLoading

export const getNextPage = state =>
  ( state.ids && state.ids.length ? Math.min( ...state.ids ) : undefined )

export const getTweetsFromState = state =>
  ( state.ids || [] ).map( getTweet( state ) )



const dedup = nums => [ ...new Set( nums ) ]
//
// reducers

// tweet IDs
const ids = handleActions( {
  [ receivedTweets ]: ( state, { payload } ) =>
    dedup( state.concat( payload.map( getID ) ) ),
}, [] )

// tweets in a map, by ID
const byId = handleActions( {
  [ receivedTweets ]: ( state, { payload } ) =>
  payload.reduce( ( map, tweet ) =>
    Object.assign( map, {
      [ getID( tweet ) ]: tweet,
    } ), state )
}, {} )

// tweet loading state
const isLoading = handleActions( {
  [ loadingTweets ]: () => true,
  [ loadingTweetsFailed ]: () => false,
  [ receivedTweets ]: () => false,
}, false )

export default combineReducers( {
  ids,
  byId,
  isLoading,
} )

