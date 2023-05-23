
// index 區塊
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


// menu 區塊
const cartBtn = document.querySelector(".cart");
const closeBtn = document.querySelector(".close");
const shopingCard = document.querySelector(".shopingCard");
const shopingCardContent = document.querySelector(".shopingCard__list__content");
const quantity = document.querySelector(".quantity");
const total = document.querySelector(".checkout__total");
const productWrapper = document.querySelector(".menu__content__list__wrapper");
const sentBtn = document.querySelector(".checkout__send");
const message = document.querySelector(".send__message");



cartBtn.addEventListener("click", function(){
  shopingCard.classList.add("active");
})


closeBtn.addEventListener("click", function(){
  shopingCard.classList.remove("active");
  message.classList.remove("active");
})

const products = [
  {
    id: 1,
    name: "桃子晶凍星冰樂",
    image: "flappuccino01.png",
    price: 155
  },
  {
    id: 2,
    name: "抹茶可可星冰樂",
    image: "flappuccino02.png",
    price: 150
  },
  {
    id: 3,
    name: "芒果乳酪星冰樂",
    image: "flappuccino03.png",
    price: 160
  },
  {
    id: 4,
    name: "醇濃抹茶星冰樂",
    image: "flappuccino04.png",
    price: 140
  },
  {
    id: 5,
    name: "焦糖咖凍星冰樂",
    image: "flappuccino05.png",
    price: 125
  },
  {
    id: 6,
    name: "乳香野莓星冰樂",
    image: "flappuccino06.png",
    price: 125
  },
  {
    id: 7,
    name: "草莓乳酪星冰樂",
    image: "flappuccino07.png",
    price: 155
  },
  {
    id: 8,
    name: "摩卡焦糖星冰樂",
    image: "flappuccino08.png",
    price: 130
  },
  {
    id: 9,
    name: "綿滑甜薯星冰樂",
    image: "flappuccino09.png",
    price: 130
  },
]


let shoppingCardList = [];



function showProduct(){
  products.forEach(function(item, index){
      
       let str = `
      <div class="menu__content__list__card">
          <div class="card__img"><img src="assets/images/${item.image}" alt="星冰樂照片"></div>
          <h2>${item.name}</h2>
          <p class="price">NT$<span>${item.price}</span></p>
          <button class="addToCart" onclick="addToCart(${index})"><i class='bx bx-plus-circle'></i>加入購物車</button>
      </div>
      `;

      productWrapper.innerHTML += str;
  })
  const addToCartBtn = document.querySelectorAll(".addToCart");

  addToCartBtn.forEach(function(item){
    item.addEventListener("click", function(){
      message.classList.remove("active");
    })
  })
}

showProduct();

function addToCart(index){
  if(shoppingCardList[index] == null){
    // 舉例：讓購物清單陣列索引值 8 的位置之物件，等同於產品列表陣列的索引值8
    // 因為是索引 8 對 8 ，不是一般用push從頭把物件加入陣列的指定方式
    // 如果去印出購物清單陣列，會出現： [empty × 8, {…}]，顯示長度為 9，因為只加入索引值8也就是第九個，所以前面會有8個空位
    
    // 先轉 JSON 再轉物件，進行深拷貝之後，斷開連結！才可以將這批「新的物件」塞給購物車清單陣列。
    // 不這樣轉換的話，之後購物車清單有任何異動，都會影響到原始的 products 陣列，計算價格時會出問題。

    // shoppingCardList[index] = products[index]; //舊的寫法會影響到原始陣列
  
    shoppingCardList[index] = JSON.parse(JSON.stringify(products[index]));
    shoppingCardList[index].quantity = 1;
    console.log(shoppingCardList[index]);
    console.log(JSON.stringify(products[index]));
    console.log(JSON.parse(JSON.stringify(products[index])));
  }
  reloadShoppingCard();
};


// 渲染購物車清單畫面
function reloadShoppingCard(){
  shopingCardContent.innerHTML = "";
  let count = 0;
  let totalPrice = 0;
  
  shoppingCardList.forEach(function(item, index){
    totalPrice = totalPrice + item.price;
    count = count + item.quantity;

    if(item !== null){
      let str = `
      <li class="shopingCard__list__item">
        <div class="shopping__img"><img src="assets/images/${item.image}" alt=""></div>
        <div>
          <p class="shopping__name">${item.name}</p>
          <p class="shopping__price">NT$<span>${item.price}</span></p>
        </div>
        <div class="shopping__quantity">
            <button class="minus" onclick="changeQuantity(${index},${item.quantity - 1})"><i class='bx bx-minus' ></i></button>
            <div class="count">${item.quantity}</div>
            <button class="plus"  onclick="changeQuantity(${index},${item.quantity + 1})"><i class='bx bx-plus'></i></button>
        </div>
      </li>
      `;
      shopingCardContent.innerHTML += str;
     }

  })
  //購物清單底下的總價計算結果
  total.textContent = totalPrice.toLocaleString();
  //購物車icon上面的數量
  quantity.textContent = count; 
}

// 參數 quantityChanged 在按下去購物車清單內的加減符號時，後來才把這個計算後的值帶進來函式內
// 用這個最新的數量值，賦予給購物車清單陣列內的物件的 quantity 屬性。
// 如果數量值被改變到等於0，就直接把這個對應索引值的物件，從購物清單陣列中刪除
// 購物清單陣列中的物件「價錢」，用最新得到的數量值乘以原始產品清單的「單價」
// 一有更動，就用最新的 購物車清單陣列的內容，重新渲染出來購物車清單畫面

function changeQuantity(index, quantityChanged){
    if(quantityChanged == 0){
      shoppingCardList.splice(index,1);
    }else{
      shoppingCardList[index].quantity = quantityChanged;
      console.log(quantityChanged);
      shoppingCardList[index].price = quantityChanged * products[index].price;
    }
    reloadShoppingCard()
}

//按下送出訂單就清空購物車陣列，並重新渲染購物車畫面
sentBtn.addEventListener("click", function(){
  shoppingCardList = [];
  reloadShoppingCard()

  message.classList.add("active");
})