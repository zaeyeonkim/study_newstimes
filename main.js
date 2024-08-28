const API_KEY = `348afcab51a34515bfc1ca301d0b8ba9`;
let menu = document.querySelectorAll(".menu button");
let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");
let totalResult = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;
let newsList = [];

menu.forEach(menu => menu.addEventListener("click", (event) => getCategory(event)));

let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);

const getNews = async () => {
    try {
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No Result for this search");
            }
            newsList = data.articles;
            totalResult = data.totalResults; // Fix the typo from totalResult to totalResults
            render();
            paginationRender();
        } else {
            throw new Error(data.message);
        } 
    } catch (error) {
        errorRender(error.message);
    }
};

const errorRender = (message) => {
    document.getElementById("news-board").innerHTML =
    `<h3 class="text-center alert alert-danger mt-1">${message}</h3>`;
}

const getLateNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    getNews();
};

const getCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
    getNews();
};

const getKeyword = async () => {
    const keyword = searchInput.value;
    url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);
    getNews();
};

searchButton.addEventListener("click", getKeyword);
searchInput.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        getKeyword();
    }
});

const render = () => {
    const newsHTML = newsList.map(
        (news) => `
            <div class="row news">
                <div class="col-lg-4">
                    <img class="news-img-size" src="${news.urlToImage || 'default-image-url.jpg'}" />
                </div>
                <div class="col-lg-8">
                    <h2>${news.title}</h2>
                    <p>${news.description}</p>
                    <div>${news.source.name} * ${news.publishedAt}</div>
                </div>
            </div>
        `
    ).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
};

const paginationRender = () => {
    const totalPage = Math.ceil(totalResult / pageSize);
    const pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;

    if (lastPage > totalPage) {
        lastPage = totalPage;
    }

    const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML = '';
    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `<li class="page-item ${i === page ? "active" : ""}">
            <a class="page-link" href="#" onclick="movePage(${i})">${i}</a>
        </li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationHTML;
};

const movePage = (pageNum) => {
    page = pageNum;
    getNews();
};

getLateNews();
