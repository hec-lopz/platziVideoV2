const API_URL = 'https://yts.mx/api/v2/list_movies.json?genre=:name';




(async function load(){

  const $form = document.getElementById('form')
  $form.addEventListener('submit', (event) => {
    event.preventDefault()
  })

  async function getMovieData(genre) {
    const GENRE_URL = API_URL.replace(':name', genre)
    const response = await fetch(GENRE_URL)
    const movie_data = await response.json()
    return movie_data
  }
  action_list = await getMovieData('action')
  drama_list = await getMovieData('drama')
  animation_list = await getMovieData('animation')
    
  const $action_container = document.getElementById('action_container')
  const $drama_container = document.getElementById('drama_container')
  const $animation_container = document.getElementById('animation_container')

  fillMovieContainer($action_container, action_list)
  fillMovieContainer($drama_container, drama_list)
  fillMovieContainer($animation_container, animation_list)

})()




function addClickEvent($element) {
  $element.addEventListener('click', () => {
    alert('Click')
  })
}

function fillMovieContainer(container, list) {
  container.children[0].remove()
  list.data.movies.forEach(movie => {
    const HTMLString = generateHTMLTemplate(movie)
    const movieItem = getMovieItemHTML(HTMLString)
    container.append(movieItem)
    addClickEvent(movieItem)
  });
}

function getMovieItemHTML(HTMLString) {
  const html = document.implementation.createHTMLDocument()
  html.body.innerHTML = HTMLString
  return html.body.children[0]
}

function generateHTMLTemplate(movie) {
  return `<div class="listings__movie-item">
            <figure class="movie-item__cover">
              <img src="${movie.medium_cover_image}" alt="" class="cover-image">
            </figure>
            <h4 class="movie-item__title">${movie.title}</h4>
          </div>`
}