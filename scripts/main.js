const API_URL = 'https://yts.mx/api/v2/list_movies.json?genre=:name';
let action_list
let drama_list
let animation_list


(async function load(){
  async function getMovieData(genre) {
    const GENRE_URL = API_URL.replace(':name', genre)
    const response = await fetch(GENRE_URL)
    const movie_data = await response.json()
    return movie_data
  }
  action_list = await getMovieData('action')
  
  drama_list = await getMovieData('drama')
  
  animation_list = await getMovieData('animation')
  
})()
