let options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};
function editRating(ratingString){
  // var ratingArray = ratingString.split("");
  return ratingString[0]
}

let movieData;
const getMovies = () => {

  let moviesReq = fetch("https://alkaline-aluminum-bulb.glitch.me/movies", options)
    .then(resp => resp.json())
    .then(function (movies) {
      movieData = movies;
      let htmlStr = "";
      console.log(movies); //I prefer to write data with the function tbh.
      for (let movie of movies) {


        htmlStr += `
<div class="cardBox">
    <button class="btn btn-danger testD deleteButton" data-value="${movie.id.toString()}">Remove Movie</button>
    <button class="editButton btn btn-info testE" data-value="${movie.id.toString()}">Save Changes</button>
    <div class="leftSide">
      <img src="${movie.poster}" class="image" alt="...">
      <h5 class="title editTitle" contenteditable="true">${movie.title}</h5>
      <div class="genre">${movie.genre}</div>
    </div>
    <div class="content">
      <div class="plot editPlot" contenteditable="true">${movie.plot}</div>
      <div class="notPlot">
        <div class="rating editRating"><span contenteditable="true">${movie.rating}</span> out of 5</div>
        <div class="releaseYear editYear">Release year: <span contenteditable="true">${movie.year}</span></div>
        <div class="directedBy editDirector">Directed by: <span contenteditable="true">${movie.director}</span></div>
      </div>
    </div>
</div>`
      }
      $("#container").html(htmlStr);

    })
    .then(function(){
      //Delete event needs to be inside so it happens after the
      $(".testD").click(function () {
        console.log("button clicked");
        var idTag = $(this).attr("data-value");
        console.log(idTag);
        let deleteMovie = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        };

  let inputVal = $('#movie-id-delete').val();
  fetch(`https://alkaline-aluminum-bulb.glitch.me/movies/${idTag}`, deleteMovie)
    .then(getMovies)
      });
    })
    .then(function(){

// EDIT movie / each change needs drop down options
      $(".testE").click(function(){
        // console.log("edit button click")
        let editThis = {
          "title": $(this).parent().children().children('.editTitle').text(),
          "plot": $(this).parent().children().children('.editPlot').text(),
          "rating": $(this).parent().children("ul").children('.editRating').children().text(),
          "year": $(this).parent().children("ul").children('.editYear').children().text(),
          "director": $(this).parent().children("ul").children('.editDirector').children().text(),
        }
        // console.log(editThis);

        let editOptions = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editThis)
        };

        let editMovieinputVal = $(this).attr("data-value");

        fetch(`https://alkaline-aluminum-bulb.glitch.me/movies/${editMovieinputVal}`, editOptions).then(getMovies);

      });

    })
}
getMovies();

// POST new movie
//I made it so it can add all the new movie data automatically using the other API instructions below:



$('#newMovieButton').click(() => {

  let newMovie = {
    "title": $('#newMovieTitle').val(),
    "rating": $('#newMovieRating').val(),

  };
  //We define this here so we can use it later.
  let OMDBData;



  function testMovie() {
    let result;

    movieData.forEach(function (movieE, indexE) {
      if (movieE.title === newMovie.title) {
        // alert(`${newMovie.title} is already on the list.`)
        result = false
      }
    });
    return (result === undefined)
  }

  //We don't want to define this yet either.
  let postNewMovie;


  console.log(OMDBData);
  //The OMDB_KEY is ignored I will send you the key ASAP.
  fetch(`http://www.omdbapi.com/?t=${newMovie.title}&apikey=${OMDB_KEY}`)
    .then(resp => resp.json())
    .then(newMovieData => {
      console.log(newMovieData);
      //We define the OMDBdata with the data from the other API
      OMDBData = {
        "title": newMovieData.Title,
        "rating": $('#newMovieRating').val(),
        "year": newMovieData.Year,
        "director": newMovieData.Director,
        "genre": newMovieData.Genre,
        "actors": newMovieData.Actors,
        "plot": newMovieData.Plot,
        "poster": newMovieData.Poster

      };

    }).then(function () {

    //Posts movie to glitch movies
    fetch("https://alkaline-aluminum-bulb.glitch.me/movies")
      .then(resp => resp.json())
      .then(movies => {

        postNewMovie = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(OMDBData)
        };
        if (testMovie()) {
          fetch("https://alkaline-aluminum-bulb.glitch.me/movies", postNewMovie)
            .then(getMovies)
            .then(console.log(movies))
        } else {
          alert("hey, that movie already exists!");
        }
      })
  })
})




