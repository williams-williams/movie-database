let options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
}
const getMovies = () => {

  let moviesReq = fetch("https://spotted-melodic-yew.glitch.me/movies", options)
    .then(resp => resp.json())
    // .then(resp => { //Idk why this line isn't work...
    //   resp.json()
    // })
    // .then(data => {
    //   console.log(data)
    //   })
    .then(function (movies) {
      let htmlStr = "";
      console.log(movies); //I prefer to write data with the function tbh.
      for (let movie of movies) {
        htmlStr += `<div class="card" style="width: 18rem;">
    <img src="${movie.poster}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${movie.title.toUpperCase()}</h5>
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
