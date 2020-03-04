const $modal = document.getElementById('modal');
const $modal_title = $modal.querySelector('h1')
const $modal_cover = $modal.querySelector('img')
const $modal_description = $modal.querySelector('p')

const $overlay = document.getElementById('overlay');
const $hide_modal = document.getElementById('hide-modal');
const $action_container = document.getElementById('action_container')
const $drama_container = document.getElementById('drama_container')
const $animation_container = document.getElementById('animation_container');
const $form = document.getElementById('form')
const $grid_layout = document.querySelector('.grid-layout')
const $featuring_container = document.getElementById('featuring');

const $friend_list = document.getElementById('friend-list')

const API_URL = 'https://yts.mx/api/v2/list_movies.json?:get';
const loader_gif = 'https://raw.githubusercontent.com/LeonidasEsteban/jquery-to-js-curso/master/src/images/loader.gif';
const TOP_MOVIES = 'https://yts.mx/api/v2/list_movies.json?minimum_rating=9';

(async function load(){
  $form.addEventListener('submit', async (event) => {
    event.preventDefault()
    $grid_layout.classList.add('search-active')
    $loader = document.createElement('img')
    setAttributes($loader, {
      src: loader_gif,
      height: 50,
      width: 50, 
    })
    $featuring_container.innerHTML = ""
    $featuring_container.append($loader)

    const data = new FormData($form)
    try {
      const {
        data: {
          movies: movie
        }
      } = await getMovieData(`limit=1&query_term=${data.get('name')}`)
      const HTMLString = featuringTemplate(movie[0])
      $featuring_container.innerHTML = HTMLString
    } catch(error) {
      errorMessage(error.message)
      $grid_layout.classList.remove('search-active')
      $loader.remove()
    }
  })
  
  async function getMovieData(request) {
    const GENRE_URL = API_URL.replace(':get', request)
    const response = await fetch(GENRE_URL)
    const movie_data = await response.json()
    if (movie_data.data.movie_count) {
      return movie_data
    } else {
      throw new Error('No encontramos tu película. :c')
    }
  }

  async function cachePresence(genre) {
    const cached = `${genre}_list`
    const list = localStorage.getItem(cached)
    if (list) {
      return JSON.parse(list)
    }
    const { data: {movies: data} } = await getMovieData(`genre=${genre}`)
    localStorage.setItem(`${genre}_list`, JSON.stringify(data))
    return data

  }
  try {
    var action_list = await cachePresence('action')
    fillMovieContainer($action_container, action_list, 'action')
  
    var drama_list = await cachePresence('drama')
    fillMovieContainer($drama_container, drama_list, 'drama')
  
    var animation_list = await cachePresence('animation')
    fillMovieContainer($animation_container, animation_list, 'animation')
  } catch(error) {
    errorMessage('No pudimos conseguir la información. :c')
    console.log(error)
  }
          
  $hide_modal.addEventListener('click', hideModal);
  $overlay.addEventListener('click', hideModal);
  
  function lookForId(list, id) {
    return list.find( item => item.id === parseInt(id))
  }
  function findMovie(id, genre) {
    switch (genre) {
      case 'action' :
          return lookForId(action_list, id) 
        break;
      case 'drama' :
          return lookForId(drama_list, id)
        break;
      case 'top' :
        return lookForId(top_movies_list, id)
      default:
          return lookForId(animation_list, id)
    }
  }
  function setAttributes($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute])
    }
  }
  

  function hideModal() {
    setTimeout(() => $overlay.classList.remove('active'), 700)
    $modal.style.animation = 'modalOut .8s forwards'
    if ($modal.classList.contains('my-info')) {
      $modal.classList.remove('my-info')
    }
  }
  function showModal($element) {
    $overlay.classList.add('active')
    $modal.style.animation = 'modalIn .8s forwards'
    if($modal.style.alignItems === 'center') {
      $modal.style.alignItems = 'initial'
    }
    if ($element.dataset.username === 'my-info') {
      showMyInfo($element);

    } else if ($element.dataset.username) {
      showUserInfo($element, findUser);

    } else {
      showMovieItem($element, findMovie);

    }
  }
  
  function addClickEvent($element) {
    $element.addEventListener('click', () => {
      showModal($element)
      
    })
  }
  
  function fillMovieContainer(container, list, genre) {
    container.children[0].remove()
    list.forEach(movie => {
      const HTMLString = generateHTMLTemplate(movie, genre)
      const movieItem = getMovieItemHTML(HTMLString)
      container.append(movieItem)
      movieItem.querySelector('img').addEventListener('load', (event) => {
        event.target.classList.add('fadeIn')

      })
      addClickEvent(movieItem)
    });
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


  async function getUserData(number) {
    const USERS_API = `https://randomuser.me/api/?results=${number}`
    const response = await fetch(USERS_API)
    const data = await response.json()
    return data
  }
  const {results: user_list} = await getUserData(10)
  fillUserList(user_list)

  function fillUserList(list) {
    console.log(list)
    list.forEach(user => {
      const HTMLString = generateUserTemplate(user)
      const HTMLObject = getMovieItemHTML(HTMLString)
      $friend_list.append(HTMLObject)
      addClickEvent(HTMLObject)
      
    })
  }
  let top_movies_list;
  function findUser(username) {
    return user_list.find( user => user.login.username === username)
  }
  (async function getTopMovies() {
    const top_container = document.getElementById('top_container')
    async function getMovieList() {
      const top_list = await fetch(TOP_MOVIES)
      const data = await top_list.json()
      return data
    }
    const { data: { movies: top_movies } } = await getMovieList()
    fillTopList(top_movies)
    top_movies_list = top_movies
    
    
    function fillTopList(list) {
      list.forEach(movie => {
        const HTMLString = generateTopTemplate(movie)
        const movieItem = getMovieItemHTML(HTMLString)
        top_container.append(movieItem)
        addClickEvent(movieItem)
      })
    }
  
    function generateTopTemplate(movie) {
      return (`
      <li data-id='${movie.id}' data-genre='top'class="song-name list-item">
        <a>
          ${movie.title}
        </a>
      </li>`)
    }
  })()
  
const $my_info = document.querySelector('.username')
$my_info.addEventListener('click', () => {
  const HTMLString = generateAppDescriptionHTML()
  const HTMLObject = getMovieItemHTML(HTMLString)
  $modal.classList.add('my-info')
  showModal(HTMLObject)
})

})();


function showMovieItem($element, findMovie) {
  const movie_id = $element.dataset.id;
  const movie_genre = $element.dataset.genre;
  const found_movie = findMovie(movie_id, movie_genre);
  $modal_title.textContent = found_movie.title;
  $modal_cover.setAttribute('src', found_movie.medium_cover_image);
  $modal_description.textContent = found_movie.description_full;
}

function showUserInfo($element, findUser) {
  const username = $element.dataset.username;
  const found_user = findUser(username);
  $modal_title.textContent = `${found_user.name.first} ${found_user.name.last}`;
  $modal_cover.setAttribute('src', found_user.picture.large);
  $modal_description.textContent = ``;
  $modal.style.alignItems = 'center';
}

function showMyInfo($element) {
  $modal_title.textContent = $element.querySelector('h1').textContent;
  $modal_cover.setAttribute('src', $element.querySelector('img').getAttribute('src'));
  $modal_description.innerHTML = '';
  $modal_description.append($element.querySelector('p'));
}

function getMovieItemHTML(HTMLString) {
  const html = document.implementation.createHTMLDocument()
  html.body.innerHTML = HTMLString
  return html.body.children[0]
}
function errorMessage(error) {
  Swal.fire({
    title: 'Oh, rayos!',
    text: error,
    icon: 'error',
    confirmButtonText: 'Cool',
  })
}
function generateUserTemplate(user) {
return  (`<li data-username='${user.login.username}' class="friend-item list-item">
    <figure class="profile-container">
        <img src="${user.picture.thumbnail}" alt="">
    </figure>
    <span>${user.name.first} ${user.name.last}</span>
</li>`)

}




function generateAppDescriptionHTML() {
  return `
  <div data-username='my-info' >
    <h1 >Gracias por tu Visita</h1>
    <div class="modal-content">
      <img src="https://avatars2.githubusercontent.com/u/58668448?s=460&v=4" alt="" width="170" height="256">
      <p>
        Mi nombre es Héctor López y soy Desarrollador Web.
        <br/>
        <br/> Esta aplicación está hecha con HTML, CSS y Javascript puros, es un ejercicio de práctica hecho en este <a href='https://platzi.com/clases/jquery-js/' >curso</a> de Platzi. Puedes encontrar el repositorio <a href='https://github.com/hec-lopz/platziVideoV2'>aquí</a>.
        <br/>
        <br/>Utilicé las siguientes API's para obtener los datos de las películas y los usuarios:
        <br/>Películas: <a href='https://yts.mx/api'>yts.mx</a>
        <br/>Usuarios: <a href='https://randomuser.me/'>random-user.me</a>
      </p>
    </div>
  </div>
  `
}
