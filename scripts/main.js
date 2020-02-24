const API_URL = 'https://yts.mx/api/v2/list_movies.json?genre=:name';
const $modal = document.getElementById('modal');
const $overlay = document.getElementById('overlay');
const $hide_modal = document.getElementById('hide-modal');
$hide_modal.addEventListener('click', hideModal);


(async function load(){
  const $action_container = document.getElementById('action_container')
  const $drama_container = document.getElementById('drama_container')
  const $animation_container = document.getElementById('animation_container')
  const $form = document.getElementById('form')
  const $grid_layout = document.querySelector('.grid-layout')
  

  $form.addEventListener('submit', (event) => {
    event.preventDefault()
    $grid_layout.classList.add('search-active')
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
    
  

  fillMovieContainer($action_container, action_list)
  fillMovieContainer($drama_container, drama_list)
  fillMovieContainer($animation_container, animation_list)

})()


function hideModal() {
  $overlay.classList.remove('active')
  $modal.style.animation = 'modalOut .8s forwards'
}
function showModal() {
  $overlay.classList.add('active')
  $modal.style.animation = 'modalIn .8s forwards'

}

function addClickEvent($element) {
  $element.addEventListener('click', () => {
    showModal()

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