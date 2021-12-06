const movies = document.getElementById('movies')
const movieModal = document.getElementById('movie-modal')
const modalContainer = document.getElementById('movie-modal-container')
const modalContent = document.getElementById('movie-modal-content')
const closeBtn = document.getElementById('times')
const movieRelease = document.getElementsByClassName('movie-release')
const loader = document.getElementById('loader')
const loaderModal = document.getElementById('movie-modal-loader')

let films = []

const getFilms = async () => {
    const res = await fetch('https://swapi.dev/api/films')
    const data = await res.json()
    films = data.results
    loader.style.display = 'none'
    movies.innerHTML = 
        films.map((film, index)=> 
            `<div class="movie-release" onclick="openMovieModal(${index})"><p>${film.title}<br>${film.release_date}</p></div>`).join(' ') 
}

const openMovieModal = () => {
    for (let i = 0; i < movieRelease.length; i++) {
        movieRelease[i].addEventListener('click', () => {
            movieModal.style.display = 'flex';
            showMovie(i)
        })
    }
}

const charPromises = (index) => {
    const promises = films[index].characters.map( async (url) => {
      const res = await fetch(url)
      return await res.json()
    });
    return promises;
}
        
const showMovie = async (index) => {
    const res = await Promise.all(charPromises(index))
    res.sort((a, b) => (a.name > b.name) ? 1 : -1)
    modalContent.innerHTML = 
        `<div id="modal-left">
            <h1>${films[index].title}</h1><br>
            <img src="./media/${index}.jpeg"><br>
            <p>&OpenCurlyDoubleQuote;${films[index].opening_crawl}&CloseCurlyDoubleQuote;</p>
        </div>
        <div id="modal-right">
            <h1>Characters:</h1>`+ 
            res.map((arr) => `<p>${arr.name}</p>`).join('') + 
        `</div>`
    loaderModal.style.display = 'none'
    modalContainer.style.display = 'block'
    modalContent.style.display = 'flex'
}

const closeMovieModal = () => {
    closeBtn.addEventListener('click', () => {
        movieModal.style.display = 'none'
        modalContainer.style.display = 'none'
        loaderModal.style.display = 'flex'
    })
}

window.addEventListener('load', () => {
    getFilms()
    openMovieModal();
    closeMovieModal();
})


