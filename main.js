const API_KEY = `fcf420e215274c94ad037440fcbb825f`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
// console.log("menus: ", menus);
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

const getLatestNews = async () => {
  // URL : URL 인스턴스 -> url에 필요한 함수와 변수들을 제공함
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&apiKey=${API_KEY}`
  );
  console.log("url: ", url); // url 확인

  const response = await fetch(url); // fetch : url 호출(해당 url의 데이터를 가져옴)
  console.log("response: ", response);

  const data = await response.json();
  console.log("data: ", data);

  newsList = data.articles;
  console.log("data.articles: ", newsList);

  render();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category: ", category); // 카테고리 눌렀을 때 클릭 이벤트 잘 작동하는지 확인
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("data: ", data);

  newsList = data.articles;

  render();
};

const getNewsByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  console.log("keyword: ", keyword); // 카테고리 눌렀을 때 클릭 이벤트 잘 작동하는지 확인
  const url = new URL(
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data: ", data);

  newsList = data.articles;

  document.getElementById("search-input").value = "";

  render();
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

getLatestNews();
