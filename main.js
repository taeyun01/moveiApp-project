const imgUrl = "https://image.tmdb.org/t/p/w500"; // 이미지 가져오는 URL

const baseUrl =
  "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"; // API url

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MWVlNGI2NTU4OTY2MGQ5YTIzNjhmZTY2Y2I2MDRjZiIsInN1YiI6IjYyMmUzZDllMGU0NDE5MDAxYjZiMTk4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oVSbiD8--Vl_94Pt3IKQPiPSlUWuKMc3m7USZIHad-U",
  },
};

fetch(baseUrl, options)
  .then((response) => response.json())
  .then((data) => {
    let movieData = data.results;
    let movieTitleData = movieData.map((movie) => {
      return movie.title; // map은 값을 새배열에 할당해서 반환
    });

    const movieDataLength = data.results.length; // 데이터 길이(갯수)
    const randomMovie =
      data.results[Math.floor(Math.random() * movieDataLength)]; // 랜덤으로 영화 뽑기
    const randomMovieTitle = randomMovie.title; // 랜덤 제목
    const randomMoviePoster = randomMovie.poster_path; // 랜덤 원본 포스터
    const randomMovieId = randomMovie.id; // 랜덤 ID
    const randomMovieOverview = randomMovie.overview; // 랜덤 내용
    const randomMovieAverage = parseFloat(randomMovie.vote_average.toFixed(1)); // 랜덤 평점
    // toFixed(1)은 소수점이하 한 자리까지 반올림하여 문자열로 반환. parseFloat()문자열을 소수점 숫자로 변환

    const mainMovieContainer = document.querySelector(".main-movie-container"); // 메인 영화 컨테이너 div
    const mainMovieImg = document.querySelector(".main-movie-image"); // 메인 영화 포스터
    const mainMovieTitle = document.querySelector(".main-movie-title"); // 메인 영화 제목
    const mainMovieContent = document.querySelector(".main-movie-content"); // 메인 영화 내용
    const mainDetailBtn = document.querySelector(".main-movie-detail-btn"); // 상세정보 버튼

    const searchResultBox = document.querySelector(".search-result-box"); // 검색 결과 div
    const searchInput = document.querySelector(".search-input"); // 검색창 input
    const movieCardsContainer = document.querySelector(
      ".movie-cards-container"
    ); // 영화 카드 컨테이너 div

    const modalContainer = document.querySelector(".modal-container"); // 모달 컨테이너
    const modalClose = document.querySelector(".modal-close"); // 모달 닫기
    const modalTitle = document.querySelector(".modal-title"); // 모달 제목
    const modalAverage = document.querySelector(".modal-average"); // 모달 평정
    const modalContent = document.querySelector(".modal-content"); // 모달 내용
    const modalImg = document.querySelector(".modal-img"); // 모달 이미지
    const modald = document.querySelector(".modal-id"); // 모달 ID

    mainMovieTitle.innerHTML = randomMovieTitle; // main영화제목(랜덤)
    mainMovieImg.src = imgUrl + randomMoviePoster; // main포스터(랜덤)
    mainMovieContent.innerHTML = randomMovieOverview; // main영화내용(랜덤)

    searchInput.focus(); // 검색창 포커스

    // 영화 카드 리스트 ui
    movieCardsContainer.innerHTML = movieData
      .map(
        (movie) =>
          `
			<li class="movie-cards-box">
				<div class="movie-cards-image-box">
					<img class="movie-cards-image" src="${imgUrl + movie.poster_path}" alt="이미지">
				</div>
				<p class="movie-cards-title">${movie.title}</p>
			</li>`
      )
      .join("");

    const movieCardsBox =
      movieCardsContainer.getElementsByClassName("movie-cards-box"); // 영화 카드 목록
    const selectMovieTitle = document.querySelector(".select-movie-title"); // 선택 영화 제목
    const selectMovieImg = document.querySelector(".select-movie-image"); // 선택 영화 포스터
    const selectMovieContent = document.querySelector(".select-movie-content"); // 선택 영화 내용
    const selectDetailBtn = document.querySelector(".select-movie-detail-btn"); // 선택 상세정보 버튼
    const selectMovieContainer = document.querySelector(
      ".select-movie-container"
    );

    mainMovieContainer.classList.remove("active"); // 초기화
    selectMovieContainer.classList.remove("active"); // 초기화

    // 영화 카드 선택 시, 메인에 출력
    // HTML로 묶여진 요소들은 유사배열 객체임. for문으로 순회가능, map, forEach로 순회하고 싶다면 Array.from("유사배열")사용시 새로운 Array를 생성해줌
    Array.from(movieCardsBox).forEach((movie, i) => {
      movie.addEventListener("click", () => {
        selectMovieTitle.id = movieData[i].id; // 타이틀요소에 id속성 생성
        selectMovieTitle.innerHTML = movieData[i].title; // 선택한 영화 제목
        selectMovieImg.src = imgUrl + movieData[i].poster_path; // 선택한 영화 포스터
        selectMovieContent.innerHTML = movieData[i].overview; // 선택한 영화 내용
        selectMovieContent.id = parseFloat(
          movieData[i].vote_average.toFixed(1)
        ); // 평점 id속성에 저장
        mainMovieContainer.classList.add("active");
        selectMovieContainer.classList.add("active");
        selectMovieImg.classList.add("active");
        selectModal();
      });
    });

    // 선택한 영화 상세정보 버튼 클릭시
    selectDetailBtn.addEventListener("click", () => {
      selectModal();
    });

    // 검색시 관련 검색어 UI 출력
    searchResultBox.innerHTML = movieData
      .map(
        (movie) =>
          `<a href="#" class="search-list">
    		  <div class="search-cont">
    			  <h3 class="search-cont-title">${movie.title}</h3>
    		  </div>
      	</a>`
      )
      .join("");

    // 검색창 입력 시 해당 영화가 있으면 바로 보여주기
    searchInput.addEventListener("input", (e) => {
      const searchInputValue = e.target.value.toUpperCase(); // 입력값 저장

      movieTitleData.forEach((title, index) => {
        const movieCardsBox = document.querySelectorAll(".movie-cards-box"); // 영화 카드 박스 div 모두가져오기
        const movieTitle = title;
        const searchTitleValue =
          movieTitle.toUpperCase().indexOf(searchInputValue) > -1; // 영화제목이 내가 입력한 값이 포함되는지

        // 검색어가 포함되어 있다면
        if (searchTitleValue) {
          movieCardsBox[index].style.display = "flex"; // 검색어가 포함된 영화면 카드UI 출력
          searchResultBox.style.display = "block"; // 검색창 출력
        } else {
          movieCardsBox[index].style.display = "none";
          searchResultBox.style.display = "block";
        }
      });
    });

    // 연관 검색
    searchInput.addEventListener("input", (e) => {
      const inputValue = e.target.value.toUpperCase();
      const aTags = searchResultBox.getElementsByTagName("a"); //searchResultBox내에 있는 a태그 전부 가져오기

      for (let i = 0; i < aTags.length; i++) {
        const searchContTag = aTags[i].getElementsByClassName("search-cont")[0];
        const searchTextValue = searchContTag.textContent; // 영화 제목 text 할당
        const isSearchTitle =
          searchTextValue.toUpperCase().indexOf(inputValue) > -1; // 현재 영화리스트에 내가 입력한 영화가 있는지?? 있으면 true, 없으면 false반환

        isSearchTitle
          ? (aTags[i].style.display = "flex") // 검색한 영화가 있으면 필터 ui 출력
          : (aTags[i].style.display = "none");

        // 연관검색 클릭시
        aTags[i].addEventListener("click", () => {
          searchResultBox.style.display = "none"; // 검색 필터박스는 none.
          const title = aTags[i].textContent.trim(); // 내가 선택한 제목 할당 (trim()공백제거)
          searchInput.value = title; // 검색창에 제목 삽입
          searchInput.focus(); // 검색창 포커스
        });

        if (searchInput.value == 0) {
          aTags[i].style.display = "none";
        }
      }
    });

    // 검색창 엔터시
    searchInput.addEventListener("keydown", (e) => {
      const searchInputValue = e.target.value.toUpperCase(); // 입력값 저장

      // 엔터 누를시 (엔터 코드:13)
      if (e.keyCode === 13) {
        movieTitleData.forEach((title, index) => {
          const movieCardsBox = document.querySelectorAll(".movie-cards-box"); // 영화 카드 박스 div
          const movieTitle = title;
          const searchTitleValue =
            movieTitle.toUpperCase().indexOf(searchInputValue) > -1; // 영화리스트에 내가 입력한 영화가 있는지??

          // 검색어가 포함되어 있다면
          if (searchTitleValue > -1 && searchTitleValue === true) {
            movieCardsBox[index].style.display = "flex"; // 검색어가 포함된 영화면 카드UI 출력
          } else {
            movieCardsBox[index].style.display = "none";
          }
        });
      }
    });

    // 선택한 영화 모달창 데이터
    const selectModal = () => {
      modalMovieData(
        selectMovieTitle.id,
        selectMovieTitle.textContent,
        selectMovieImg.src,
        selectMovieContent.textContent,
        selectMovieContent.id
      );
    };

    // 메인 상세정보 버튼 클릭시
    mainDetailBtn.addEventListener("click", () => {
      modalMovieData(
        randomMovieId,
        randomMovieTitle,
        imgUrl + randomMoviePoster,
        randomMovieOverview,
        randomMovieAverage
      );
    });

    // 영화 모달창 데이터
    const modalMovieData = (id, title, poster, overview, average) => {
      modald.innerHTML = id;
      modalTitle.innerHTML = title;
      modalImg.src = poster;
      modalContent.innerHTML = overview;
      modalAverage.innerHTML = average;

      modalContainer.classList.add("open");
      modalContainer.classList.remove("close");
    };

    // 모달창 닫기(X)
    modalClose.addEventListener("click", () => {
      modalContainer.classList.add("close");
      modalContainer.classList.remove("open");
    });
  })
  .catch((err) => console.error(err));
