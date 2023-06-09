// index 區塊
const circle = document.querySelector(".circle")
const landingProductBigImg = document.querySelector(".landing__product__big img");
const landingProductBigText = document.querySelector(".landing__product__big p");
const thumbItems = document.querySelectorAll(".thumb__item");
const footerCol = document.querySelectorAll(".footer__info__col");

//首頁飲料縮圖點擊切換大圖
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


// 卡片輪播 carousel
const carouselWrapper = document.querySelector(".carousel__wrapper");

// 如果卡片輪播元素存在於 DOM 上才執行相關步驟，否則切換分頁後會因為找不到元素報錯
if(carouselWrapper) {
  const carousel = document.querySelector(".carousel");
  const arrowBtns = document.querySelectorAll(".carousel__wrapper button");
  const firstCardWidth = document.querySelector(".carousel__card").offsetWidth;

// 左右按鈕點擊滑動卡片
arrowBtns.forEach(function(btn){
  btn.addEventListener("click", function(){
    // 如果點擊到的是左箭頭，整個 carousel 位移第一張卡片寬度的「負值」以及 gap 寬度，若點擊到的不是左箭頭，代表是右箭頭，就加上第一張卡片寬度和 gap 寬度
    // 用 += 處理，若一直點箭頭就一直累計位移值
    carousel.scrollLeft += btn.id === "left" ? (-firstCardWidth-16) : (firstCardWidth+16);
  })
});


// 滑鼠拉動方式去滑動卡片
let isDragging = false;
let startX;
let startScrollLeft;

// isDragging 預設是 false ，draggingStart 函式可以改變它的狀態，而 draggingStart 的執行則是透過監聽 mousedown 事件觸發
// mousedown 事件是監聽滑鼠按下時
// 也就是說必須要滑鼠在 carousel 範圍內有點擊下去的動作，整個 carousel 才會開始可以滑動。否則若滑鼠指示移進去範圍內，並不會觸發滑動。
function draggingStart(e){
  isDragging = true;
  carousel.classList.add("dragging");
  // 紀錄初始值
  // 滑鼠點擊下去的 e.pageX 初始值
  // 滑鼠點擊下去時 carousel 左邊位移的初始值，會是 0 ，因為還沒開始 drag 。
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
  //console.log("這是 e.pageX: " + startX);
  //console.log("這是 carousel.scrollLeft: " + startScrollLeft); //初始是 0 
};

// 如果 isDragging 是 false 就什麼也不做
// pageX 是從該點到「整個網頁頁面 page」最左邊的距離
function dragging(e){
  if(!isDragging) return;
  // 滑鼠 drag 位移後，會偏移一開始點擊下去的位置
  // e.pageX 是當下滑鼠位置，startX 是當初點擊下去的位置
  // 如果 drag 是往左拉動，則 e.pageX < startX ，相減就是負值。
  // 例如：相減後為 -15，startScrollLeft -(-15) = 0 +15 = 15; 整個 carousel 就只往右移動 15px。
  // 如果 scrollLeft 值小於 0，那麼 scrollLeft值將變為 0。
  // 如果 scrollLeft 值大到元素內容最大程度，那麼 scrollLeft 設置的值將被設置為元素最大程度。
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX); 
  //console.log("滑鼠當下位置 - 滑鼠點擊初始值 = " + (e.pageX - startX)); 
  //console.log("最新的 scrollLeft = " + (carousel.scrollLeft));

};

// mouseup 事件是滑鼠按鍵放開時觸發
function draggingStop(e){
  isDragging = false;
  carousel.classList.remove("dragging");
};

// 滑到最左或是最右就隱藏按鈕
// carousel.scrollLeft 可能會是浮點數，要先處理成最接近的大於等於整數，再比較
// carousel.scrollWidth 會連裡面的子元素寬度都包含，所以 overflow 的卡片寬度都算進來。
// carousel.offsetWidth 則是只計算元素本身寬度，所以只計算 carousel 容器看得見的部分，溢出去的子層寬度不會算進來。
function hideBtn(){
  if(carousel.scrollLeft === 0){
    console.log("已經滑到最左邊");
    arrowBtns[0].style.display = "none";
  }else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
    console.log("已經滑到最右邊");
    arrowBtns[1].style.display = "none";
  }else{
    //除此之外，只要不是最左或是最右ㄝ就兩邊都顯示按鈕。
    showArrowLeft();
    showArrowRight();
  }
};

// 顯示左按鈕
function showArrowLeft(){
  arrowBtns[0].style.display = "block";
};

// 顯示右按鈕
function showArrowRight(){
  arrowBtns[1].style.display = "block";
};

// 一旦開始點擊右按鈕，則左按鈕恢復顯示
arrowBtns[1].addEventListener("click", showArrowLeft)

// 一旦開始點擊左按鈕，則右按鈕恢復顯示
arrowBtns[0].addEventListener("click", showArrowRight)

carousel.addEventListener("mousedown", draggingStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", draggingStop);

// 監聽卡片是否已經滑到最左或是最右
carousel.addEventListener("scroll", hideBtn); // 點擊按鈕時
document.addEventListener("mouseup", hideBtn); // 用滑鼠 drag 拖曳時

}


//footer手機版手風琴折疊
footerCol.forEach(function(item, index){
  const footerColHead = item.querySelector(".footer__info__head");
  footerColHead.addEventListener("click", function(){
    item.classList.toggle("open");
    const footerInfoItem = item.querySelector(".footer__info__item");

    if(item.classList.contains("open")){  
      footerInfoItem.style.height = `${footerInfoItem.scrollHeight}px`;
      footerInfoItem.style.marginBottom = "20px";
      item.querySelector("i").classList.replace("bx-chevron-down", "bx-chevron-up");
    }else{
      footerInfoItem.style.height = 0;
      footerInfoItem.style.marginBottom = "0px";
      item.querySelector("i").classList.replace("bx-chevron-up", "bx-chevron-down");
    }
    removeOpen(index); //把目前點擊到的 col 索引值傳入函式中
  })
});

//比對所有的 footerCol 的索引值，和目前點擊到的 footerCol 索引值是否相同
//索引值相同的才打開，不相同的關閉。也就是只打開點擊到的那個 col
function removeOpen(index1){
  footerCol.forEach(function(item2, index2){
    if(index1 !== index2){
      item2.classList.remove("open");
      const footerInfoItem2 = item2.querySelector(".footer__info__item");
      footerInfoItem2.style.height = "0px";
      footerInfoItem2.style.marginBottom = "0px";
      item2.querySelector("i").classList.replace("bx-chevron-up", "bx-chevron-down");
    }
  })
}


// menu 區塊
const cartBtn = document.querySelector(".cart");
const closeBtn = document.querySelector(".close");
const shopingCard = document.querySelector(".shopingCard");
const shopingCardContent = document.querySelector(".shopingCard__list__content");
const quantity = document.querySelector(".quantity");
const total = document.querySelector(".checkout__total");
const productWrapper = document.querySelector(".menu__content__list__wrapper");
const sendBtn = document.querySelector(".checkout__send");
const message = document.querySelector(".send__message");
const reminder = document.querySelector(".reminder");
const hamburger = document.querySelector(".hamburger-menu");
const navList = document.querySelector(".nav__list");
const cover = document.querySelector(".cover");
const landingContent = document.querySelector(".landing__content");


// 行動版漢堡 menu
hamburger.addEventListener("click", function(){
  navList.classList.toggle("active");
  if(navList.classList.contains("active")){
    hamburger.querySelector("i").className = "bx bx-x";
    cover.classList.add("active")
    document.body.style.overflow="hidden";
    landingContent ? landingContent.style.zIndex = "-1" : console.log("show menu"); //若 landingContent 存在於 DOM 就修改其 z-index，若不存在就印出 "show menu"
  }else{
    hamburger.querySelector("i").className = "bx bx-menu";
    cover.classList.remove("active")
    document.body.style.overflow="auto";
    landingContent ? landingContent.style.zIndex = "0" : console.log("hide menu");
  }
})

//購物車icon點擊事件
cartBtn.addEventListener("click", function(){
  shopingCard.classList.add("active");
  cover.classList.add("active")
  landingContent ? landingContent.style.zIndex = "-1" : console.log("show menu"); 
  //當視窗窄到購物清單會擋住商品，難以點擊商品加入時，就讓商品頁無法滑動，才不會干擾到行動版購物清單的捲動手感。
  //但如果瀏覽器視窗寬度夠寬，購物清單開啟也不會遮住產品時，依然可捲動商品頁面，點擊加入購物車。
  if(window.innerWidth < 1680){
    document.body.style.overflow="hidden";
  }
})

//購物清單關閉按鈕點擊事件
closeBtn.addEventListener("click", function(){
  shopingCard.classList.remove("active");
  cover.classList.remove("active");
  landingContent ? landingContent.style.zIndex = "0" : console.log("hide menu");
  message.classList.remove("active");
  reminder.classList.remove("active");
  sendBtn.style.backgroundColor = "#323232";
  document.body.style.overflow="auto";
  navList.classList.remove("active");
  hamburger.querySelector("i").className = "bx bx-menu";
})

//產品清單陣列
const products = [
  {
    id: 1,
    name: "桃子晶凍星冰樂",
    image: "flappuccino01.png",
    price: 155,
    quantity:1
  },
  {
    id: 2,
    name: "抹茶可可星冰樂",
    image: "flappuccino02.png",
    price: 150,
    quantity:1
  },
  {
    id: 3,
    name: "芒果乳酪星冰樂",
    image: "flappuccino03.png",
    price: 160,
    quantity:1
  },
  {
    id: 4,
    name: "醇濃抹茶星冰樂",
    image: "flappuccino04.png",
    price: 140,
    quantity:1
  },
  {
    id: 5,
    name: "焦糖咖凍星冰樂",
    image: "flappuccino05.png",
    price: 125,
    quantity:1
  },
  {
    id: 6,
    name: "乳香野莓星冰樂",
    image: "flappuccino06.png",
    price: 125,
    quantity:1
  },
  {
    id: 7,
    name: "草莓乳酪星冰樂",
    image: "flappuccino07.png",
    price: 155,
    quantity:1
  },
  {
    id: 8,
    name: "摩卡焦糖星冰樂",
    image: "flappuccino08.png",
    price: 130,
    quantity:1
  },
  {
    id: 9,
    name: "綿滑甜薯星冰樂",
    image: "flappuccino09.png",
    price: 130,
    quantity:1
  },
]

//宣告一個空的購物清單陣列
let shoppingList = [];

//把產品清單陣列渲染在畫面上
function showProduct(){
  products.forEach(function(item, index){
      
       let str = `
      <div class="menu__content__list__card">
          <div class="card__img"><img src="assets/images/${item.image}" alt="星冰樂照片"></div>
          <h2>${item.name}</h2>
          <p class="price">NT$<span>${item.price}</span></p>
          <button class="addToCart" ontouchstart onclick="addToCart(${index})"><i class='bx bx-plus-circle'></i>加入購物車</button>
      </div>
      `;
      if(productWrapper){productWrapper.innerHTML += str};      
  })

  const addToCartBtn = document.querySelectorAll(".addToCart");

  //點擊加入購物車按鈕時，移除提示訊息
  addToCartBtn.forEach(function(item){
    item.addEventListener("click", function(){
      reminder.classList.remove("active");
      message.classList.remove("active");
    })
  })
}

showProduct();

// 舊的加入購物車寫法綁死索引值，會使複製過去的陣列內出現 empty，計算陣列長度時會不合理。
// 例如：讓購物清單陣列索引值 8 的之物件，對應等於，產品清單陣列的索引值8物件
// 因為是索引 8 對 8 ，跟使用 push 方法從頭把物件加入陣列的方式不同
// 若去印出購物清單陣列，會發現明明只加入一個物件，但是陣列長度為 9
// 顯示 [empty × 8, {…}]
// 因為加入物件被指定放在索引值8的位置，前面因此產生索引值 0~7 的空位
// function addToCart(index){
//   if(shoppingList[index] == null){
//     // shoppingList[index] = products[index]; (舊的寫法有問題)
//     // 要先轉 JSON 再轉物件，進行深拷貝之後，斷開連結！才可以將這批「新的物件」塞給購物車清單陣列。
//     // 若沒有深拷貝直接賦值過去，之後購物車清單有任何異動，都會影響到原始的 products 陣列，計算價格時會出問題。
    
//     // let newObj = JSON.parse(JSON.stringify(products[index]));
//     // shoppingList.push(newObj);
//     shoppingList[index] = JSON.parse(JSON.stringify(products[index]));
//     shoppingList[index].quantity = 1;
//   }
//   reloadShoppingCard();
// };


//加入購物車新寫法
function addToCart(index){
    //先深拷貝products陣列對應索引值之物件，再賦予給變數，才不會影響到原始 products 陣列的內容
    let newObj = JSON.parse(JSON.stringify(products[index]));

    //篩選 id 組出一個id 陣列 
    let mapResult = shoppingList.map(function(obj){
      return obj.id;
  })

    // includes()方法會回傳true or false
    // 當 mapResult.includes(newObj.id) 回傳 false 時，才加入清單
    // 也就是，如果購物清單陣列內的物件id，不包含此物件id，意指 id 沒有重複，才可以加入購物清單
    // if 括號內添加一個驚嘆號，轉成 true ，去執行加入購物車的動作。 
    if(!mapResult.includes(newObj.id)){
      shoppingList.push(newObj);
    }

    console.log(shoppingList);
    
    reloadShoppingCard();

};


// 渲染購物車清單畫面
function reloadShoppingCard(){
  shopingCardContent.innerHTML = "";
  let count = 0;
  let totalPrice = 0;
  
  shoppingList.forEach(function(item, index){
    //總金額是 0 + 目前購物清單內所有品項的 price 總和
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
            <button type="button" class="minus" onclick="changeQuantity(${index},${item.quantity - 1})"><i class='bx bx-minus' ></i></button>
            <div class="count">${item.quantity}</div>
            <button type="button" class="plus"  onclick="changeQuantity(${index},${item.quantity + 1})"><i class='bx bx-plus'></i></button>
        </div>
        <button type="button" class="close__product" onclick="deleteProduct(${index})"><i class='bx bx-x'></i></button>
      </li>
      `;
      shopingCardContent.innerHTML += str;
     }
  })

  //購物清單底下的總價計算結果
  total.textContent = totalPrice.toLocaleString();
  //購物車icon上面的數量
  quantity.textContent = count; 
  
  //儲存目前購清單陣列內的狀態
  saveData();
  saveQ();
}

// 參數 quantityChanged 在按下去購物車清單內的加減符號時，就會進行加減，並這個計算後的值帶進來函式內
// 把這個最新的數量，賦值給「購物車清單」這個陣列內的，物件的 quantity 屬性。
// 如果數量值被改變到小於貨等於0時，就讓產品最少數量等於1
// 購物清單陣列，即時價格：最新數量 x 原始產品清單的「單價」
// 有任何變動，就重新渲染出來購物車清單畫面

// 修改購物車商品購買數量
function changeQuantity(index, quantityChanged){
    if(quantityChanged == 0 || quantityChanged < 0){
      shoppingList[index].quantity = 1;
    }else{
      shoppingList[index].quantity = quantityChanged;
      shoppingList[index].price = quantityChanged * products[index].price;
    }
    reloadShoppingCard();
}

// 點擊購物車商品刪除按鈕，就將此產品從購物車陣列中刪除，並重新渲染購物車
function deleteProduct(index){
  shoppingList.splice(index,1); 
  reloadShoppingCard();
};

// 按下送出訂單就清空購物清單陣列，並重新渲染購物車畫面
sendBtn.addEventListener("click", function(){
    if(shopingCardContent.innerHTML == ""){
      reminder.classList.add("active");
      message.classList.remove("active");
    }else{
      message.classList.add("active");
      shoppingList = [];
      reloadShoppingCard();
      
      sendBtn.style.backgroundColor = "#007542";
      localStorage.clear(); //清空 localStorage
    }
})


//localStorage 只能放純字串，所以要把購物清單陣列內的物件轉 JSON 格式再儲存
function saveData(){
  localStorage.setItem("list", JSON.stringify(shoppingList));
}

// 如果 localStorage 內有儲存東西才渲染，如果沒東西就不做事。
// 把存在localStorage的純字串資料，先轉成物件，賦值給陣列shoppingList，再渲染購物車畫面
function showTask(){
    if(localStorage.getItem("list") !== null){
      shoppingList = JSON.parse(localStorage.getItem("list"));
      console.log(shoppingList);
      reloadShoppingCard();
    }
}

showTask();


// 這裡的 quantity變數是指購物車 icon 右上角的數字
function saveQ(){
  localStorage.setItem("counting", quantity.textContent);
}

// 如果 localStorage 有資料，就把存著的數字取出來，渲染購物車右上角 icon 內數字
// 如果 localStorage 內沒有資料，就讓數字為 0 
function showQ(){
  if(parseInt(quantity.textContent)>0){
    quantity.textContent =  localStorage.getItem("counting");
  }else if(parseInt(quantity.textContent) == 0){
    quantity.textContent = "0";
  }
}

showQ();

