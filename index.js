import{a as p,i as u,S as f}from"./assets/vendor-BgmC94F3.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function l(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(e){if(e.ep)return;e.ep=!0;const a=l(e);fetch(e.href,a)}})();const y=s=>`
    <li class="gallery-card">
    <a class = "js-gallery-link" href = "${s.largeImageURL}"> <img class="gallery-img" src="${s.webformatURL}" alt="${s.tags}"/></a>
    <div class="stats-container">
        <ul class="stats-list">
            <li class="gallery-item">
                <span class="label">Likes</span>
                <span class="value">${s.likes}</span>
            </li>
            <li class="gallery-item">
                <span class="label">Views</span>
                <span class="value">${s.views}</span>
            </li>
            <li class="gallery-item">
                <span class="label">Comments</span>
                <span class="value">${s.comments}</span>
            </li>
            <li class="gallery-item">
                <span class="label">Downloads</span>
                <span class="value">${s.downloads}</span>
            </li>
        </ul>
    </div>
</li>`;p.defaults.baseURL="https://pixabay.com";document.querySelector(".js-loader");const m=async(s,r)=>{const l={key:"52947144-373b760a7dc07b63f24b6c37a",q:s,image_type:"photo",orientation:"horizontal",page:r,per_page:15,safesearch:!0};return(await p.get("/api/?",{params:l})).data};let d=null;const h=()=>{d?d.refresh():d=new f(".js-gallery a",{captionDelay:250,captionsData:"alt"})},t={searchForm:document.querySelector(".js-search-form"),gallery:document.querySelector(".js-gallery"),loader:document.querySelector(".js-loader"),loadMoreBtn:document.querySelector(".js-load-more-btn")};let n=1,c;const g=async s=>{try{n++,t.loader.classList.add("is-active");const r=await m(c,n),l=r.hits.map(i=>y(i)).join("");t.gallery.insertAdjacentHTML("beforeend",l),h(),t.loader.classList.remove("is-active");const a=document.querySelector(".gallery-card").getBoundingClientRect().height*2;window.scrollBy({top:a,behavior:"smooth"}),n*15>=r.totalHits&&(t.loadMoreBtn.classList.add("is-hidden"),t.loadMoreBtn.removeEventListener("click",g),u.show({message:"We're sorry, but you've reached the end of search results.",color:"blue",position:"topCenter"}))}catch(r){console.log(r)}},L=async s=>{s.preventDefault();const{target:r}=s;if(c=r.elements.user_query.value.trim(),c.length===0){u.show({title:"WARNING",message:"Search query cannot be empty!",color:"red",position:"topCenter"});return}t.gallery.innerHTML="",t.loader.classList.add("is-active"),t.loadMoreBtn.classList.add("is-hidden"),n=1;try{const l=await m(c,n);if(l.hits.length===0){u.show({message:"Sorry, there are no images matching your search query. Please try again!",color:"red",position:"topCenter"});return}l.totalHits>l.hits.length?(t.loadMoreBtn.classList.remove("is-hidden"),t.loadMoreBtn.addEventListener("click",g)):t.loadMoreBtn.classList.add("is-hidden");const o=l.hits.map(e=>y(e)).join("");t.gallery.innerHTML=o,h()}catch(l){console.log(l)}finally{t.loader.classList.remove("is-active")}};t.searchForm.addEventListener("submit",L);
//# sourceMappingURL=index.js.map
