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
        htmlStr += `<div class="card" style="width: 18rem;">
    <img src="${movie.poster}" class="card-img-top" alt="...">
    <button class="btn btn-danger testD"data-value="${movie.id.toString()}">Remove Movie</button>
    <div class="card-body">
      <h5 class="card-title editTitle" contenteditable="true" >${movie.title}</h5>
      <p class="card-text editPlot" contenteditable="true">${movie.plot}</p>
    </div>
    <button class="btn btn-info testE" data-value="${movie.id.toString()}">Edit Movie</button>
    <ul class="list-group list-group-flush">

     <li class="list-group-item editRating"><span contenteditable="true">${movie.rating}</span> out of 5</li>
     <li class="list-group-item editYear">Release year: <span contenteditable="true">${movie.year}</span></li>
     <li class="list-group-item editDirector">Directed by: <span contenteditable="true">${movie.director}</span></li>
    </ul>
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


$('#newMovieButton').click(() => {

  let newMovie = {
    "title": $('#newMovieTitle').val(),
    "rating": $('#newMovieRating').val(),

  };


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

  // console.log(testMovie())

  let postNewMovie = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newMovie)
  };
  

  fetch("https://alkaline-aluminum-bulb.glitch.me/movies")
    .then(resp => resp.json())
    .then(movies => {
      // for (let movie of movies) {
      if (testMovie()) {
        fetch("https://alkaline-aluminum-bulb.glitch.me/movies", postNewMovie)
          .then(getMovies)
          .then(console.log(movies))
      } else {
        alert("hey, that movie already exists!");
        // break;
      }
      // }
    })
})



// // EDIT movie / each change needs drop down options
// $("#editMovieButton").click(function(){
//   let editThis = {
//     "title": $('#editTitle').val(),
//     "plot": $('#editPlot').val(),
//     "rating": $('#editRating').val(),
//     "year": $('#editYear').val(),
//     "director": $('#editDirector').val(),
//   }
//
//   let editOptions = {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(editThis)
//   };
//
//   // let editMovieinputVal = $('#movie-id-edit').val();
//
//   fetch(`https://alkaline-aluminum-bulb.glitch.me/movies/${editMovieinputVal}`, editOptions).then(getMovies);
//
// });


