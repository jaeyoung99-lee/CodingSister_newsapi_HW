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
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // &page=page
    url.searchParams.set("pageSize", pageSize); // &pageSize=pageSize
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResult = data.totalResults;
      render();
      paginationRender();
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
  page = 1; // 다른 카테고리 선택 시 페이지를 1로 초기화
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

const paginationRender = () => {
  // 직접 정해줘야 하는 값들
  // totalResult
  // page
  // pageSize
  // groupSize

  // 계산해야하는 것들
  // totalPage
  const totalPage = Math.ceil(totalResult / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = groupSize * pageGroup;
  // 마지막 pageGroup이 groupSize보다 작은 경우 => lastPage = totalPage
  if (lastPage > totalPage) {
    lastPage = totalPage;
  }
  // firstPage
  let firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;

  paginationHTML = `<li class="page-item" id="previous-button1" onclick="moveToPage(1)"><a class="page-link" href="#">&lt;&lt;</a></li>`;
  paginationHTML += `<li class="page-item" id="previous-button2" onclick="moveToPage(${
    page - 1
  })"><a class="page-link" href="#">&lt;</a></li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})">
        <a class="page-link" href="#">
          ${i}
        </a>
      </li>`;
  }

  paginationHTML += `<li class="page-item" id="next-button1" onclick="moveToPage(${
    page + 1
  })"><a class="page-link" href="#">&gt;</a></li>`;
  paginationHTML += `<li class="page-item" id="next-button2" onclick="moveToPage(${totalPage})"><a class="page-link" href="#">&gt;&gt;</a></li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;

  toggleNavigationButtons(page, totalPage);
};

const moveToPage = (pageNum) => {
  console.log("moveToPage : ", pageNum);
  page = pageNum;
  getNews();
};

const toggleNavigationButtons = (page, totalPage) => {
  document
    .getElementById("previous-button1")
    .classList.toggle("hidden", page <= 1);
  document
    .getElementById("previous-button2")
    .classList.toggle("hidden", page <= 1);
  document
    .getElementById("next-button1")
    .classList.toggle("hidden", page >= totalPage);
  document
    .getElementById("next-button2")
    .classList.toggle("hidden", page >= totalPage);
};

getLatestNews();
