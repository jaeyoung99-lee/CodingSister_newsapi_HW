const API_KEY = `fcf420e215274c94ad037440fcbb825f`;
let news = [];

const getLatestNews = async () => {
    // URL : URL 인스턴스 -> url에 필요한 함수와 변수들을 제공함
    const url = new URL(`https://codingsister-newsapi-hw.netlify.app/top-headlines?country=us&apiKey=${API_KEY}`);
    console.log("url: ", url); // url 확인
    
    const response = await fetch(url); // fetch : url 호출(해당 url의 데이터를 가져옴)
    console.log("response: ", response);

    const data = await response.json();
    console.log("data: ", data);

    news = data.articles;
    console.log("data.articles: ", news);
};

getLatestNews();