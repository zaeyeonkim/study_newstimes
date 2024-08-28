const API_KEY = `348afcab51a34515bfc1ca301d0b8ba9`;
let menu = document.querySelectorAll(".menu button");
menu.forEach(menu => menu.addEventListener("click", (event)=> getCategory(event)));
let newsList = [];

const getLateNews = async () => {
    const url = new URL (`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
    console.log ("dddd", newsList);
};

const getCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    const url = new URL (`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render ();
};

const getKeyword = async () => {
    const keyword = document.getElementById("search-input").value;
    const url = new URL (`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);
    const response = await fetch(url);
    const data = await response.json();
    newsList = data.articles;
    render();
}

let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", getKeyword);
searchInput.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        getKeyword();
    }
});

const render = () => {
    const newsHTML = newsList.map(
        (news) =>`
                <div class="row news">
                    <div class="col-lg-4">
                        <img class="news-img-size" src=${news.urlToImage || 'default-image-url.jpg'} />
                    </div>
                    <div class="col-lg-8">
                        <h2>
                            ${news.title}
                        </h2>
                        <p>
                            ${news.description}
                        </p>
                        <div>
                            ${news.source.name} * ${news.publishedAt}
                        </div>
                    </div>
                </div>
        `).join('');

    document.getElementById("news-board").innerHTML = newsHTML;
}

getLateNews();