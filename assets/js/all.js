"use strict";

// index 區塊
var circle = document.querySelector(".circle");
var landingProductBigImg = document.querySelector(".landing__product__big img");
var landingProductBigText = document.querySelector(".landing__product__big p");
var thumbItems = document.querySelectorAll(".thumb__item");
thumbItems.forEach(function (item) {
  // item.childNodes[0] 是 thumb__item 裡面的 img 元素
  item.addEventListener("click", function (e) {
    //縮圖被點擊到，就用縮圖src替換掉大圖src
    //縮圖被點擊到，就用縮圖data-name的值，替換掉 p 的內容
    landingProductBigImg.src = e.currentTarget.childNodes[0].src;
    landingProductBigText.textContent = e.currentTarget.dataset.name;
    circle.style.backgroundColor = e.currentTarget.dataset.color;
  });
}); // menu 區塊

var cartBtn = document.querySelector(".cart");
var closeBtn = document.querySelector(".close");
var shopingCard = document.querySelector(".shopingCard");
var shopingCardContent = document.querySelector(".shopingCard__list__content");
var quantity = document.querySelector(".quantity");
var total = document.querySelector(".checkout__total");
var productWrapper = document.querySelector(".menu__content__list__wrapper");
var sendBtn = document.querySelector(".checkout__send");
var message = document.querySelector(".send__message");
cartBtn.addEventListener("click", function () {
  shopingCard.classList.add("active");
  document.body.style.overflow = "hidden";
});
closeBtn.addEventListener("click", function () {
  shopingCard.classList.remove("active");
  message.classList.remove("active");
  document.body.style.overflow = "auto";
  sendBtn.style.backgroundColor = "#323232";
});
var products = [{
  id: 1,
  name: "桃子晶凍星冰樂",
  image: "flappuccino01.png",
  price: 155
}, {
  id: 2,
  name: "抹茶可可星冰樂",
  image: "flappuccino02.png",
  price: 150
}, {
  id: 3,
  name: "芒果乳酪星冰樂",
  image: "flappuccino03.png",
  price: 160
}, {
  id: 4,
  name: "醇濃抹茶星冰樂",
  image: "flappuccino04.png",
  price: 140
}, {
  id: 5,
  name: "焦糖咖凍星冰樂",
  image: "flappuccino05.png",
  price: 125
}, {
  id: 6,
  name: "乳香野莓星冰樂",
  image: "flappuccino06.png",
  price: 125
}, {
  id: 7,
  name: "草莓乳酪星冰樂",
  image: "flappuccino07.png",
  price: 155
}, {
  id: 8,
  name: "摩卡焦糖星冰樂",
  image: "flappuccino08.png",
  price: 130
}, {
  id: 9,
  name: "綿滑甜薯星冰樂",
  image: "flappuccino09.png",
  price: 130
}];
var shoppingList = [];

function showProduct() {
  products.forEach(function (item, index) {
    var str = "\n      <div class=\"menu__content__list__card\">\n          <div class=\"card__img\"><img src=\"assets/images/".concat(item.image, "\" alt=\"\u661F\u51B0\u6A02\u7167\u7247\"></div>\n          <h2>").concat(item.name, "</h2>\n          <p class=\"price\">NT$<span>").concat(item.price, "</span></p>\n          <button class=\"addToCart\" onclick=\"addToCart(").concat(index, ")\"><i class='bx bx-plus-circle'></i>\u52A0\u5165\u8CFC\u7269\u8ECA</button>\n      </div>\n      ");
    productWrapper.innerHTML += str;
  });
  var addToCartBtn = document.querySelectorAll(".addToCart");
  addToCartBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      message.classList.remove("active");
    });
  });
}

showProduct();

function addToCart(index) {
  if (shoppingList[index] == null) {
    // 舉例：讓購物清單陣列索引值 8 的位置之物件，等同於產品列表陣列的索引值8
    // 因為是索引 8 對 8 ，不是一般用push從頭把物件加入陣列的指定方式
    // 如果去印出購物清單陣列，會出現： [empty × 8, {…}]，顯示長度為 9，因為只加入索引值8也就是第九個，所以前面會有8個空位
    // 先轉 JSON 再轉物件，進行深拷貝之後，斷開連結！才可以將這批「新的物件」塞給購物車清單陣列。
    // 不這樣轉換的話，之後購物車清單有任何異動，都會影響到原始的 products 陣列，計算價格時會出問題。
    // shoppingList[index] = products[index]; //舊的寫法會影響到原始陣列
    shoppingList[index] = JSON.parse(JSON.stringify(products[index]));
    shoppingList[index].quantity = 1;
    console.log(shoppingList[index]);
    console.log(JSON.stringify(products[index]));
    console.log(JSON.parse(JSON.stringify(products[index])));
  }

  reloadShoppingCard();
}

; // 渲染購物車清單畫面

function reloadShoppingCard() {
  shopingCardContent.innerHTML = "";
  var count = 0;
  var totalPrice = 0;
  shoppingList.forEach(function (item, index) {
    totalPrice = totalPrice + item.price;
    count = count + item.quantity;

    if (item !== null) {
      var str = "\n      <li class=\"shopingCard__list__item\">\n        <div class=\"shopping__img\"><img src=\"assets/images/".concat(item.image, "\" alt=\"\"></div>\n        <div>\n          <p class=\"shopping__name\">").concat(item.name, "</p>\n          <p class=\"shopping__price\">NT$<span>").concat(item.price, "</span></p>\n        </div>\n        <div class=\"shopping__quantity\">\n            <button class=\"minus\" onclick=\"changeQuantity(").concat(index, ",").concat(item.quantity - 1, ")\"><i class='bx bx-minus' ></i></button>\n            <div class=\"count\">").concat(item.quantity, "</div>\n            <button class=\"plus\"  onclick=\"changeQuantity(").concat(index, ",").concat(item.quantity + 1, ")\"><i class='bx bx-plus'></i></button>\n        </div>\n      </li>\n      ");
      shopingCardContent.innerHTML += str;
    }
  }); //購物清單底下的總價計算結果

  total.textContent = totalPrice.toLocaleString(); //購物車icon上面的數量

  quantity.textContent = count;
} // 參數 quantityChanged 在按下去購物車清單內的加減符號時，就會進行加減，並這個計算後的值帶進來函式內
// 把這個最新的數量，賦值給「購物車清單」這個陣列內的，物件的 quantity 屬性。
// 如果數量值被改變到等於0，就直接把這個對應索引值的物件，從購物清單陣列中刪除
// 購物清單陣列中的物件「價錢」，用最新得到的數量值乘以原始產品清單的「單價」
// 一有更動，就用最新的 購物車清單陣列的內容，重新渲染出來購物車清單畫面


function changeQuantity(index, quantityChanged) {
  if (quantityChanged == 0) {
    shoppingList.splice(index, 1);
  } else {
    shoppingList[index].quantity = quantityChanged;
    shoppingList[index].price = quantityChanged * products[index].price;
  }

  reloadShoppingCard();
} // 按下送出訂單就清空購物車陣列，並重新渲染購物車畫面


sendBtn.addEventListener("click", function () {
  shoppingList = [];
  reloadShoppingCard();
  message.classList.add("active");
  sendBtn.style.backgroundColor = "#007542";
  console.log("有按到click");
  localStorage.clear();
}); // function saveData(){
//   localStorage.setItem("data", JSON.stringify(shoppingList));
// }
// // 把存在瀏覽器內的資料，全部渲染到購物車內裡面
// function showTask(){
//   shoppingList = JSON.parse(localStorage.getItem("data"));
//   if(shoppingList !== null){
//     reloadShoppingCard();
//   }
// }
// showTask();
// function saveQ(){
//   localStorage.setItem("quantity", quantity.textContent);
// }
// // 把存在瀏覽器內的資料，全部渲染到購物車內裡面
// function showQ(){
//   quantity.textContent =  localStorage.getItem("quantity");
// }
// showQ();
//# sourceMappingURL=all.js.map
