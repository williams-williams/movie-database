let options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
}
const getMovies = () => {

  let moviesReq = fetch("https://spotted-melodic-yew.glitch.me/movies", options)
    .then(resp => resp.json())
    .then(function (movies) {
      let htmlStr = "";
      console.log(movies); //I prefer to write data with the function tbh.
      for (let movie of movies) {
        htmlStr += `<div class="card" style="width: 18rem;">
    <img src="${movie.poster}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">${movie.plot}</p>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">${movie.rating} out of 5</li>
      <li class="list-group-item">Release year: ${movie.year}</li>
      <li class="list-group-item">Directed by: ${movie.director}</li>
    </ul>
  </div>`
      }
      $("#container").html(htmlStr)
    })
}
getMovies();

// POST new movie
let newMovie = {
    "title": $('#newMovieTitle').innerText,
    "author": $('#newMovieRating').innerText
};

let postNewMovie = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMovie)
};

$('#newMovieButton').click(() => {
    fetch("https://spotted-melodic-yew.glitch.me/movies")
        .then(resp => resp.json())
        .then(movies => {
            for (let movie of movies) {
                if (movie.title !== newMovie.title) {
                    fetch("https://spotted-melodic-yew.glitch.me/movies", postNewMovie)
                        .then(getMovies)
                        .then(console.log(movies))
                }else {
                    alert("hey, that movie already exists!");
                    break;
                }
            }
        })

})

// DELETE movie / Be careful of what is deleted
let deleteMovie = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    }
};

$("#deleteMovieButton").click(() => {
    let inputVal = $('#movie-id-delete').val();
    fetch(`https://alkaline-aluminum-bulb.glitch.me/movies/${inputVal}`, deleteMovie)
        .then(getMovies)
});

// EDIT movie / each change needs drop down options
// let editThis = {
//     "title": $('#editTitle').innerText,
//     "plot": $('#editPlot').innerText,
//     "rating": $('#editRating').innerText,
//     "year": $('#editYear').innerText,
//     "director": $('#editDirector').innerText,
// }

// let editOptions = {
//     method: 'PATCH',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(editThis)
// };
//
// let editMovieinputVal = $('#movie-id-edit').val();
// fetch(`https://alkaline-aluminum-bulb.glitch.me/movies/${editMovieinputVal}`, editOptions).then(getMovies);