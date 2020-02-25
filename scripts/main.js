const $modal = document.getElementById('modal');
const $overlay = document.getElementById('overlay');
const $hide_modal = document.getElementById('hide-modal');
const $action_container = document.getElementById('action_container')
const $drama_container = document.getElementById('drama_container')
const $animation_container = document.getElementById('animation_container');
const $form = document.getElementById('form')
const $grid_layout = document.querySelector('.grid-layout')
const $featuring_container = document.getElementById('featuring');

const API_URL = 'https://yts.mx/api/v2/list_movies.json?:get';
const loader_gif = 'https://raw.githubusercontent.com/LeonidasEsteban/jquery-to-js-curso/master/src/images/loader.gif';


(async function load(){
  
  $form.addEventListener('submit', async (event) => {
    event.preventDefault()
    $grid_layout.classList.add('search-active')
    $loader = document.createElement('img')
    setAttributes($loader, {
      src: loader_gif,
      height: 50,
      widtt: 50,
    })
    $featuring_container.append($loader)

    const data = new FormData($form)
    const {
      data: {
        movies: movie
      }
    } = await getMovieData(`limit=1&query_term=${data.get('name')}`)
    const HTMLString = featuringTemplate(movie[0])
    $featuring_container.innerHTML = HTMLString
  })
  
  async function getMovieData(request) {
    const GENRE_URL = API_URL.replace(':get', request)
    const response = await fetch(GENRE_URL)
    const movie_data = await response.json()
    return movie_data
  }
  action_list = await getMovieData('genre=action')
  drama_list = await getMovieData('genre=drama')
  animation_list = await getMovieData('genre=animation')
  
  fillMovieContainer($action_container, action_list, 'action')
  fillMovieContainer($drama_container, drama_list, 'drama')
  fillMovieContainer($animation_container, animation_list, 'animation')
  $hide_modal.addEventListener('click', hideModal);
  $overlay.addEventListener('click', hideModal);
  
})()

function setAttributes($element, attributes) {
  for (const attribute in attributes) {
    $element.setAttribute(attribute, attributes[attribute])
  }
}

function hideModal() {
  setTimeout(() => $overlay.classList.remove('active'), 700)
  $modal.style.animation = 'modalOut .8s forwards'
}
function showModal($element) {
  $overlay.classList.add('active')
  $modal.style.animation = 'modalIn .8s forwards'
  const movie_id = $element.dataset.id
  const movie_genre = $element.dataset.genre
}

function addClickEvent($element) {
  $element.addEventListener('click', () => {
    showModal($element)
    
  })
}

function fillMovieContainer(container, list, genre) {
  container.children[0].remove()
  list.data.movies.forEach(movie => {
    const HTMLString = generateHTMLTemplate(movie, genre)
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

function generateHTMLTemplate(movie, genre) {
  return `<div class="listings__movie-item" data-id="${movie.id}" data-genre="${genre}">
            <figure class="movie-item__cover">
              <img src="${movie.medium_cover_image}" alt="" class="cover-image">
            </figure>
            <h4 class="movie-item__title">${movie.title}</h4>
          </div>`
        }
function featuringTemplate(movie) {
  return (
  `
  <div class="featuring">
        <figure class="featuring-image">
          <img src="${movie.medium_cover_image}" alt="${movie.title}" width="70" height="100" >
        </figure>
        <div class="featuring-content">
          <p class="featuring-title">Película encontrada</p>
          <p class="featuring-album">${movie.title}</p>
        </div>
      </div>
  `
  )
}