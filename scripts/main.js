const API_URL = 'https://yts.mx/api/v2/list_movies.json?genre=:name';


(async function load(){
  async function getMovieData(genre) {
    const GENRE_URL = API_URL.replace(':name', genre)
    const response = await fetch(GENRE_URL)
    const movie_data = await response.json()
    return movie_data
  }
  const ACTION_LIST = await getMovieData('action')
  console.log('actionList', ACTION_LIST)

})()
