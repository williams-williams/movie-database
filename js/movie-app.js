let options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
};


let movieData;
const getMovies = () => {

  fetch("https://spotted-melodic-yew.glitch.me/movies", options)
    .then(resp => resp.json())
    .then(function (movies) {
      movieData = movies;
      let htmlStr = "";
      console.log(movies); //I prefer to write data with the function tbh.
      for (let movie of movies) {


        htmlStr += `
          <div class="cardBox">
              <button class="btn btn-danger deleteButton" data-value="${movie.id.toString()}">Remove Movie</button>
              <button class="editButton btn btn-info saveChangesButton" data-value="${movie.id.toString()}">Save Changes</button>
              <div class="leftSide">
                <img src="${movie.poster}" class="image" alt="...">
                <h3 class="title editTitle" contenteditable="true">${movie.title}</h3>
                <div class="genre editGenre">${movie.genre}</div>
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
      $(".deleteButton").click(function () {
        console.log("button clicked");
        let idTag = $(this).attr("data-value");
        console.log(idTag);
        let deleteMovie = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        };

  fetch(`https://spotted-melodic-yew.glitch.me/movies/${idTag}`, deleteMovie)
    .then(getMovies)
      });
    })
    .then(function(){

// EDIT movie / each change needs drop down options
      $(".saveChangesButton").click(function(){
        // console.log("edit button click")
        let editThis = {
          "title": $(this).parent().children(".leftSide").children(".editTitle").text(),
          "plot": $(this).parent().children(".content").children('.editPlot').text(),
          "rating": $(this).parent().children(".content").children('.notPlot').children(".editRating").children().text(),
          "year": $(this).parent().children(".content").children('.notPlot').children(".editYear").children().text(),
          "director": $(this).parent().children(".content").children('.notPlot').children(".editDirector").children().text(),
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
        console.log(editThis);
        fetch(`https://spotted-melodic-yew.glitch.me/movies/${editMovieinputVal}`, editOptions).then(getMovies);

      });

    })
}
getMovies();

// POST new movie
//I made it so it can add all the new movie data automatically using the other API instructions below:

$('#newMovieButton').click(() => {
  $("#newMovieButton").attr("disabled",true);

  let newMovie = {
    "title": $('#newMovieTitle').val(),
    "rating": $('#newMovieRating').val(),
  };
  //We define this here so we can use it later.
  let OMDBData;


  //tests if movie is already added by checking for matching title
  function testMovie() {
    let result;

    movieData.forEach(function (movieE, indexE) {
      if (movieE.title === newMovie.title) {
        result = false
      }
    });
    return (result === undefined)
  }
  function validMovie() {
    return OMDBData.title !== undefined
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


      console.log(validMovie())
    }).then(function () {

    //Posts movie to glitch movies
    fetch("https://spotted-melodic-yew.glitch.me/movies")
      .then(resp => resp.json())
      .then(movies => {

        postNewMovie = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(OMDBData)
        };

        if (testMovie() && validMovie()) {
          fetch("https://spotted-melodic-yew.glitch.me/movies", postNewMovie)
            .then(getMovies)
            .then(console.log(movies))
        } else {
          if (testMovie()) {
            alert("oops! that doesn't seem to be a movie we have.");
          }else if (validMovie()) {
            alert("hey, that movie already exists!");
          }
        }

      })
  }).then(function(){
    $("#newMovieButton").attr("disabled",false)
})
})




function capitalizeFirst(string) {

  let stringArray = string.toLowerCase().split(" ");
  let resultArray = [];
  stringArray.forEach(function (element, index) {
    let elementArray = element.split("");
    // console.log(elementArray)
    let firstLetter = elementArray[0].toUpperCase();
    // console.log(firstLetter)
    elementArray.splice(0, 1, firstLetter);
    // console.log(elementArray)
    element = elementArray.join("")
    resultArray.push(element);
  });
  return resultArray.join(" ");
}

//Filter or search by name

$("#filterSearchButton").click(() => {
  console.log("Button clicked");
  let genreFilter = capitalizeFirst($("#filterGenre").val());
  console.log(genreFilter)

  let filteredMovies = movieData.filter(function(movie){
    return movie.genre.indexOf(genreFilter) !== -1
  });
  console.log(filteredMovies);

  let htmlStr = "";
  for (let movie of  filteredMovies) {


    htmlStr += `
          <div class="cardBox">
              <button class="btn btn-danger deleteButton" data-value="${movie.id.toString()}">Remove Movie</button>
              <button class="editButton btn btn-info saveChangesButton" data-value="${movie.id.toString()}">Save Changes</button>
              <div class="leftSide">
                <img src="${movie.poster}" class="image" alt="...">
                <h3 class="title editTitle" contenteditable="true">${movie.title}</h3>
                <div class="genre editGenre">${movie.genre}</div>
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

});

//Filter by genre

$("#filterGenreButton").click(() => {
  console.log("Button clicked");
  let genreFilter = capitalizeFirst($("#filterGenre").val());
  console.log(genreFilter)

  let filteredMovies = movieData.filter(function(movie){
    return movie.genre.indexOf(genreFilter) !== -1
  });
  console.log(filteredMovies);

  let htmlStr = "";
  for (let movie of  filteredMovies) {


    htmlStr += `
          <div class="cardBox">
              <button class="btn btn-danger deleteButton" data-value="${movie.id.toString()}">Remove Movie</button>
              <button class="editButton btn btn-info saveChangesButton" data-value="${movie.id.toString()}">Save Changes</button>
              <div class="leftSide">
                <img src="${movie.poster}" class="image" alt="...">
                <h3 class="title editTitle" contenteditable="true">${movie.title}</h3>
                <div class="genre editGenre">${movie.genre}</div>
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

});

// Sort by rating

$("#filterRatingButton").click(() => {
  console.log("Button clicked");
  let ratingFilter = $("#filterRating").val();
  console.log(ratingFilter)

  let filteredRatings = movieData.filter(function(movie){
    return movie.rating.indexOf(ratingFilter) !== -1
  });
  console.log(filteredRatings);

  let htmlStr = "";
  for (let movie of filteredRatings) {

    htmlStr += `
          <div class="cardBox">
              <button class="btn btn-danger deleteButton" data-value="${movie.id.toString()}">Remove Movie</button>
              <button class="editButton btn btn-info saveChangesButton" data-value="${movie.id.toString()}">Save Changes</button>
              <div class="leftSide">
                <img src="${movie.poster}" class="image" alt="...">
                <h3 class="title editTitle" contenteditable="true">${movie.title}</h3>
                <div class="genre editGenre">${movie.genre}</div>
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

});

$("#reloadMoviesRatingButton").click(function(){
  getMovies();
});


