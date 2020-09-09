const localStorageCtrl = (function () {
  const cleanFavoritas = document.querySelector('.listado-favoritas');

  return {
    deleteLocalStorage(id) {
      const movieIDArray = JSON.parse(localStorage.getItem('movie-id'));
      movieIDArray.forEach((element, index) => {
        if (id === element) {
          movieIDArray.splice(index, 1);
        }
      });

      localStorage.setItem('movie-id', JSON.stringify(movieIDArray));
    },

    saveToLocalStorage(id) {
      let movieIDArray = [];
      // save movie id to local storage
      if (localStorage.getItem('movie-id') === null) {
        movieIDArray = [];
        movieIDArray.push(id);
        localStorage.setItem('movie-id', JSON.stringify(movieIDArray));
      } else {
        movieIDArray = JSON.parse(localStorage.getItem('movie-id'));
        movieIDArray.push(id);
        localStorage.setItem('movie-id', JSON.stringify(movieIDArray));
      }
    },

    getLocalStorage() {
      const ls = JSON.parse(localStorage.getItem('movie-id'));
      // validaciond e local storage
      if (ls === null) {
        const movieIDArray = [];
      } else {
        cleanFavoritas.innerHTML = '';
        ls.forEach((element, index) => {
          // fetch id movie
          apiCtrl.fetchMovieID(ls[index]).then((results) => {
            const data = results;
            // call populate id movie
            uiCtrl.populateHome(data, '.listado-favoritas');
          });
        });
      }
    },
    btnValidation(id) {
      const movieIDArray = JSON.parse(localStorage.getItem('movie-id'));
      const saveLS = document.querySelector('.save-local');
      const deleteLS = document.querySelector('.delete-local');

      movieIDArray.forEach((element) => {
        if (id === element) {
          saveLS.style.display = 'none';
          deleteLS.style.display = 'inline';
        }
      });
    },
  };
})();

// controloador de los datos de las api
const apiCtrl = (function () {
  const apiKey = '1f4f53ea57080b5a70718725b787c2ce';

  return {
    async fetchTrending() {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
      );
      const data = await response.json();

      return data.results;
    },

    async fetchRecomendas() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();

      return data.results;
    },
    async fetchUpcoming() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();

      return data.results;
    },
    async fetchPopulares() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      const data = await response.json();

      return data.results;
    },
    async fetchMovieID(id) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}credits?api_key=${apiKey}&append_to_response=videos,reviews`
      );

      const data = await response.json();

      return data;
    },
    async fetchMovieCrew(id) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
      );

      const data = await response.json();
      return data;
    },

    async fetchSearch(movie) {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=es-US&query=${movie}&page=1&include_adult=false`
      );
      const data = await response.json();

      return data.results;
    },
  };
})();

// controlador del manejo de DOM
const uiCtrl = (function () {
  // add id movie to bwoser session
  const saveID = function saveID(id) {
    sessionStorage.setItem('movieID', id);

    window.location.href = '#/current';
    return false;
  };

  return {
    clearInput: () => {
      const input = document.querySelector('.search');
      input.value = '';
    },
    populateCast: (data, clase) => {
      const carousel = document.querySelector(clase);
      const cast = document.createElement('a');
      const name = document.createElement('h1');
      name.innerHTML = `${data.name}`;
      name.classList.add('cast-name');
      cast.classList.add('card-cast');
      cast.style.backgroundImage = `url(http://image.tmdb.org/t/p/w500/${data.profile_path})`;
      cast.appendChild(name);
      carousel.appendChild(cast);
    },
    populateHome(data, clase) {
      const carousel = document.querySelector(clase);
      const movies = document.createElement('a');
      movies.classList.add('card');
      movies.onclick = () => saveID(data.id);
      movies.style.backgroundImage = `url(http://image.tmdb.org/t/p/w500/${data.poster_path})`;
      carousel.appendChild(movies);
    },

    // populate movie selected
    populateMovieSelected(data) {
      const sectionBg = document.querySelector('.current-movie');
      sectionBg.style.backgroundImage = `linear-gradient(90deg, rgba(15,23,30,1) 22%, rgba(255,255,255,0) 100%),
      url(http://image.tmdb.org/t/p/original/${data.backdrop_path})`;
      const currentMovie = document.querySelector('.show-current');
      currentMovie.innerHTML = `<div class="info-1">
      <h1 class="main-title">${data.title}</h1>
      <p class="overview">${data.overview}</p>
    </div>
    <div class="info-2">
      <h3 class="duracion">Runtime: ${data.runtime} minutes</h3>
      <h3 class="release">Release date: ${data.release_date}</h3>
      <a target="_blank" rel="noopener noreferrer" href="https://www.imdb.com/title/${data.imdb_id}/">IMBD</a>
      <a target="_blank" rel="noopener noreferrer" class= "netflix" href="https://www.netflix.com/search?q=${data.title}/">NETFLIX</a>   
      
    </div>
    <div class="info-3"> 
    <a class= "trailer" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=${data.videos.results[0].key}/"><i class="fas fa-play"></i>Watch trailer</a> 
      <button  class="save-local" href='#'></i>Add to watch list</button>
      <button  class="delete-local" href='#/favoritas'></i>Remove from watch list</button>
      </div>`;

      const clearCast = document.querySelector('.carousel-cast');
      clearCast.innerHTML = '';

      const saveLS = document.querySelector('.save-local');
      const deleteLS = document.querySelector('.delete-local');

      saveLS.onclick = () => {
        saveLS.style.display = 'none';
        deleteLS.style.display = 'inline';
        localStorageCtrl.saveToLocalStorage(data.id);
      };

      deleteLS.onclick = () => {
        saveLS.style.display = 'inline';
        deleteLS.style.display = 'none';
        localStorageCtrl.deleteLocalStorage(data.id);
      };
      localStorageCtrl.btnValidation(data.id);
    },
  };
})();

// Controlador principal de la aplicacion
const appCtrl = (function () {
  const carousel = document.querySelectorAll('.carousel-peliculas div');
  const mainContent = document.getElementById('main');
  const favoritas = document.querySelector('.favoritas');
  const current = document.querySelector('.current-info');
  const searchResults = document.querySelector('.search-results');
  const resultados = document.querySelector('.resultados');

  return {
    searchListener() {
      const form = document.querySelector('.form-search');

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.querySelector('.search').value;
        window.location.hash = '#/search';

        apiCtrl
          .fetchSearch(input)
          .then((results) => {
            const data = results;
            uiCtrl.clearInput();

            if (data.length >= 1) {
              data.forEach((element, index) => {
                if (data[index].poster_path !== null) {
                  resultados.innerHTML = '';
                  data.forEach((element, index) => {
                    uiCtrl.populateHome(data[index], '.resultados');
                  });
                } else {
                }
              });
            }
          })
          .catch((err) => console.log('no se cargo el fetch'));
      });
    },
    currentInitID() {
      const movieID = sessionStorage.getItem('movieID');
      // fetch id movie
      apiCtrl
        .fetchMovieID(movieID)
        .then((results) => {
          const data = results;
          // call populate id movie
          uiCtrl.populateMovieSelected(data);
        })
        .then()
        .catch((err) => console.log(err));

      apiCtrl
        .fetchMovieCrew(movieID)
        .then((results) => {
          const dataCast = results.cast;

          dataCast.forEach((element, index) => {
            uiCtrl.populateCast(dataCast[index], '.carousel-cast');
          });
        })
        .catch((err) => console.log('no se cargo el fetch'));
    },

    initHome() {
      // loop for cleaning the UI
      carousel.forEach((e, i) => (carousel[i].innerHTML = ''));

      apiCtrl
        .fetchTrending()
        .then((results) => {
          const data = results;
          data.forEach((element, index) => {
            uiCtrl.populateHome(data[index], '.carousel-trending');
          });
        })
        .catch((err) => console.log('no se cargo el fetch'));

      // fetch recomendadas
      apiCtrl.fetchRecomendas().then((results) => {
        const data = results;
        data.forEach((element, index) => {
          uiCtrl.populateHome(data[index], '.carousel');
        });

        // fetch latest
        apiCtrl.fetchUpcoming().then((results) => {
          const data = results;
          data.forEach((element, index) => {
            uiCtrl.populateHome(data[index], '.carousel-upcoming');
          });
        });
        // fetch latest
        apiCtrl.fetchPopulares().then((results) => {
          const data = results;
          data.forEach((element, index) => {
            uiCtrl.populateHome(data[index], '.carousel-populares');
          });
        });
      });
    },
    // router for hash
    route(route) {
      mainContent.style.display = 'none';

      if (route === '#/home') {
        current.style.display = 'none';
        favoritas.style.display = 'none';
        searchResults.style.display = 'none';
        mainContent.style.display = 'block';

        appCtrl.initHome();
        appCtrl.searchListener();
      } else if (route === '#/favoritas') {
        mainContent.style.display = 'none';
        current.style.display = 'none';
        searchResults.style.display = 'none';
        favoritas.style.display = 'block';
        localStorageCtrl.getLocalStorage();
        appCtrl.searchListener();
      } else if (route === '#/current') {
        current.style.display = 'none';
        favoritas.style.display = 'none';
        mainContent.style.display = 'none';
        searchResults.style.display = 'none';
        current.style.display = 'block';
        appCtrl.currentInitID();
        appCtrl.searchListener();
      } else if (route === '#/search') {
        appCtrl.searchListener();
        current.style.display = 'none';
        favoritas.style.display = 'none';
        mainContent.style.display = 'none';
        current.style.display = 'none';
        searchResults.style.display = 'block';
      } else {
        console.log('No page found 404');
      }
    },
  };
})(apiCtrl, uiCtrl, localStorageCtrl);
// Load home
window.onload = () => {
  window.location.hash = '#/home';
  appCtrl.initHome();
  appCtrl.searchListener();
};
// event listener for route
window.addEventListener('hashchange', () => {
  appCtrl.route(window.location.hash);
});
