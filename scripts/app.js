const movies = document.getElementById('movies')
const movieModal = document.getElementById('movie-modal')
const modalContainer = document.getElementById('movie-modal-container')
const modalContent = document.getElementById('movie-modal-content')
const closeBtn = document.getElementById('times')
const movieRelease = document.getElementsByClassName('movie-release')
const loader = document.getElementById('loader')
const loaderModal = document.getElementById('movie-modal-loader')

let films = []

//async/await function that waits untill url is fetched and result from swapi.com.
//Then the result is moved/stored into empty array called films, then sorted using conditional tenary operator in release date (latest to earliest). 
//rendent film titles & release dates on every element/object from array film. Also a onclick event is rendent on each film with their index as the argument.
const getFilms = async () => {
    const res = await fetch('https://swapi.dev/api/films')
    const data = await res.json()
    films = data.results.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1)
    loader.style.display = 'none'
    movies.innerHTML = 
    films.map((film, index)=> 
        `<div class="movie-release" onclick="openMovieModal(${index})">
            <p>${film.title}<br>${film.release_date}</p>
        </div>`).join(' ') 
}

//function that opens a modal when a film is clicked and index 'i' follows into function modalContents(i). 
const openMovieModal = () => {
    for (let i = 0; i < movieRelease.length; i++) {
        movieRelease[i].addEventListener('click', () => {
            movieModal.style.display = 'flex';
            modalContents(i)
        })
    }
}

//function that rendens each character from array film and index with async/await function. Then retuns promises.
//This is to fetch each URL for every characters depending on which film index 'i'.
const charPromises = (index) => {
    const promises = films[index].characters.map( async (url) => {
        const res = await fetch(url)
        return await res.json()
    });
    return promises;
}

//async function catched all promises from function charPromises(), followed with the argument index.
//then sorts the characters in alfabetical order before innerHTML is filled with content (title, img, opening crawl & character name) for the index 
const modalContents = async (index) => {
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

//close modal when symbol "x" is clicked
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


