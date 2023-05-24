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
var reminder = document.querySelector(".reminder");
cartBtn.addEventListener("click", function () {
  shopingCard.classList.add("active"); //當視窗窄到購物清單會擋住商品，難以點擊商品加入時，就讓商品頁無法滑動，才不會干擾到行動版購物清單的捲動手感。
  //但如果瀏覽器視窗寬度夠寬，購物清單開啟也不會遮住產品時，依然可捲動商品頁面，點擊加入購物車。

  if (window.innerWidth < 1680) {
    document.body.style.overflow = "hidden";
  }
});
closeBtn.addEventListener("click", function () {
  shopingCard.classList.remove("active");
  message.classList.remove("active");
  reminder.classList.remove("active");
  sendBtn.style.backgroundColor = "#323232";
  document.body.style.overflow = "auto";
});
var products = [{
  id: 1,
  name: "桃子晶凍星冰樂",
  image: "flappuccino01.png",
  price: 155,
  quantity: 1
}, {
  id: 2,
  name: "抹茶可可星冰樂",
  image: "flappuccino02.png",
  price: 150,
  quantity: 1
}, {
  id: 3,
  name: "芒果乳酪星冰樂",
  image: "flappuccino03.png",
  price: 160,
  quantity: 1
}, {
  id: 4,
  name: "醇濃抹茶星冰樂",
  image: "flappuccino04.png",
  price: 140,
  quantity: 1
}, {
  id: 5,
  name: "焦糖咖凍星冰樂",
  image: "flappuccino05.png",
  price: 125,
  quantity: 1
}, {
  id: 6,
  name: "乳香野莓星冰樂",
  image: "flappuccino06.png",
  price: 125,
  quantity: 1
}, {
  id: 7,
  name: "草莓乳酪星冰樂",
  image: "flappuccino07.png",
  price: 155,
  quantity: 1
}, {
  id: 8,
  name: "摩卡焦糖星冰樂",
  image: "flappuccino08.png",
  price: 130,
  quantity: 1
}, {
  id: 9,
  name: "綿滑甜薯星冰樂",
  image: "flappuccino09.png",
  price: 130,
  quantity: 1
}];
var shoppingList = [];

function showProduct() {
  products.forEach(function (item, index) {
    var str = "\n      <div class=\"menu__content__list__card\">\n          <div class=\"card__img\"><img src=\"assets/images/".concat(item.image, "\" alt=\"\u661F\u51B0\u6A02\u7167\u7247\"></div>\n          <h2>").concat(item.name, "</h2>\n          <p class=\"price\">NT$<span>").concat(item.price, "</span></p>\n          <button class=\"addToCart\" ontouchstart onclick=\"addToCart(").concat(index, ")\"><i class='bx bx-plus-circle'></i>\u52A0\u5165\u8CFC\u7269\u8ECA</button>\n      </div>\n      ");

    if (productWrapper) {
      productWrapper.innerHTML += str;
    }

    ;
  });
  var addToCartBtn = document.querySelectorAll(".addToCart"); //點擊加入購物車按鈕時，移除提示訊息

  addToCartBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      reminder.classList.remove("active");
      message.classList.remove("active");
    });
  });
}

showProduct(); //原本的加入購物車寫法會綁死索引值，使得陣列裡面會出現空的 null 
// function addToCart(index){
//   if(shoppingList[index] == null){
//     // shoppingList[index] == null 綁死了索引順序
//     // 舉例：讓購物清單陣列索引值 8 的位置之物件，等同於產品列表陣列的索引值8
//     // 因為是索引 8 對 8 ，不是一般用push從頭把物件加入陣列的指定方式
//     // 如果去印出購物清單陣列，會出現： [empty × 8, {…}]，顯示長度為 9，因為只加入索引值8也就是第九個，所以前面會有8個空位
//     // 先轉 JSON 再轉物件，進行深拷貝之後，斷開連結！才可以將這批「新的物件」塞給購物車清單陣列。
//     // 不這樣轉換的話，之後購物車清單有任何異動，都會影響到原始的 products 陣列，計算價格時會出問題。
//     // shoppingList[index] = products[index]; //舊的寫法會影響到原始陣列
//     // let newObj = JSON.parse(JSON.stringify(products[index]));
//     // shoppingList.push(newObj);
//     shoppingList[index] = JSON.parse(JSON.stringify(products[index]));
//     shoppingList[index].quantity = 1;
//     // console.log(shoppingList[index]);
//     console.log(shoppingList);
//   }
//   reloadShoppingCard();
// };
//加入購物車新寫法

function addToCart(index) {
  //先深拷貝products陣列對應索引值之物件，再賦予給變數
  var newObj = JSON.parse(JSON.stringify(products[index])); //檢查被加入之物件的id為何

  console.log(newObj.id);
  var mapResult = shoppingList.map(function (obj) {
    return obj.id;
  });
  console.log(mapResult.includes(newObj.id)); // includes()方法會回傳true or false
  // 當 mapResult.includes(newObj.id) 回傳 false 時，才加入清單
  // 也就是，如果購物清單陣列內的物件id，不包含此物件id，意指 id 沒有重複，才可以加入購物清單
  // if 括號內添加一個驚嘆號，轉成 true ，去執行加入購物車的動作。 

  if (!mapResult.includes(newObj.id)) {
    shoppingList.push(newObj);
  }

  console.log(shoppingList);
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

  quantity.textContent = count; //儲存目前購清單陣列內的狀態

  saveData();
  saveQ();
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
} // 按下送出訂單就清空購物清單陣列，並重新渲染購物車畫面


sendBtn.addEventListener("click", function () {
  if (shopingCardContent.innerHTML == "") {
    reminder.classList.add("active");
    message.classList.remove("active");
    console.log("尚未加入商品");
  } else {
    message.classList.add("active");
    shoppingList = [];
    reloadShoppingCard();
    sendBtn.style.backgroundColor = "#007542";
    console.log("有按到click");
    localStorage.clear();
  }
}); //localStorage 只能放純字串，所以要把購物清單陣列內的物件轉 JSON 格式再儲存

function saveData() {
  localStorage.setItem("data", JSON.stringify(shoppingList));
} // 如果 localStorage 內有儲存東西才渲染，如果沒東西就不做事。
// 把存在localStorage的純字串資料，先轉成物件，賦值給陣列shoppingList，再渲染購物車畫面


function showTask() {
  if (localStorage.getItem("data") !== null) {
    shoppingList = JSON.parse(localStorage.getItem("data"));
    console.log(shoppingList);
    reloadShoppingCard();
  }
}

showTask(); // 這裡的 quantity變數是指購物車 icon 右上角的數字

function saveQ() {
  localStorage.setItem("counting", quantity.textContent);
} // 如果 localStorage 有資料，就把存著的數字取出來，渲染購物車右上角 icon 內數字
// 如果 localStorage 內沒有資料，就讓數字為 0 


function showQ() {
  if (parseInt(quantity.textContent) > 0) {
    quantity.textContent = localStorage.getItem("counting");
  } else if (parseInt(quantity.textContent) == 0) {
    quantity.textContent = "0";
  }
}

showQ();
//# sourceMappingURL=all.js.map
