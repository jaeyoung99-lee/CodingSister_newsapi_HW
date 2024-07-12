const API_KEY = `fcf420e215274c94ad037440fcbb825f`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
const sideMenus = document.querySelectorAll(".side-menu-list button");
sideMenus.forEach((sideMenu) =>
  sideMenu.addEventListener("click", (event) => getNewsByCategory(event))
);
document
  .getElementById("search-input")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getNewsByKeyword();
    }
  });
let url = new URL(
  `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
);

const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      render();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
  );
  await getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  );
  await getNews();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
  );
  await getNews();
  document.getElementById("search-input").value = "";
};

const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0px";
};

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size"
                        src=${
                          news.urlToImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                        } />
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>
                        ${
                          news.description == null || news.description == ""
                            ? "내용 없음"
                            : news.description.length > 200
                            ? news.description.substring(0, 200) + "..."
                            : news.description
                        }
                    </p>
                    <div>
                        ${news.source.name || "no source"} * ${moment(
        news.publishedAt
      ).fromNow()}
                    </div>
                </div>
            </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-danger" role="alert">
  ${errorMessage}
  </div>
  `;
  document.getElementById("news-board").innerHTML = errorHTML;
};

getLatestNews();
