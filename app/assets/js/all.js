
const circle = document.querySelector(".circle")
const landingProductBigImg = document.querySelector(".landing__product__big img");
const landingProductBigText = document.querySelector(".landing__product__big p");
const thumbItems = document.querySelectorAll(".thumb__item");

thumbItems.forEach(function(item){
  // item.childNodes[0] 是 thumb__item 裡面的 img 元素
 

  item.addEventListener("click", function(e){
    //縮圖被點擊到，就用縮圖src替換掉大圖src
    //縮圖被點擊到，就用縮圖data-name的值，替換掉 p 的內容
    landingProductBigImg.src = e.currentTarget.childNodes[0].src;
    landingProductBigText.textContent = e.currentTarget.dataset.name;
    
    circle.style.backgroundColor = e.currentTarget.dataset.color;
  })
})
