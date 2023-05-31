# 星冰樂飲品選購頁 Demo

## 實作網址
gh-pages
https://judy-nihao.github.io/starbucks-demo/

GitHub Repo
https://github.com/Judy-Nihao/starbucks-demo

## 實作功能
- 主宣傳頁點擊飲料小圖同步切換大圖
- 購物車計算
- 商品加入同步購物車icon數量更新
- 商品加入即時渲染購物車品項
- 購物車內商品可修改數量＋即時計算總金額
- 跨分頁點擊仍保持購物車內容紀錄
- 送出訂單即清空購物車並出現提示文字
- 未加入任何商品就按送出訂單會出現提示文字
- RWD響應式版面調整：footer 手機版時轉化為手風琴折疊版面

![image](https://raw.githubusercontent.com/Judy-Nihao/starbucks-demo/1b68fc2cf9fc2b1de97a263c97d81a57a6e11e00/assets/images/note-01.jpeg)

![image](https://github.com/Judy-Nihao/starbucks-demo/blob/gh-pages/assets/images/note-02.jpeg?raw=true)


## 筆記


基本邏輯，有 2 份陣列，「產品清單」和「購物車清單」。

頁面上的產品是透過「產品清單陣列」渲染出來的，

而「購物車清單陣列」的渲染，則是看點擊到哪項產品，就將該產品加入至「購物車清單陣列」。

關鍵在於，「產品清單」要保持初始狀態，內容與值全部都是固定的，

會有變化的只有「購物車清單」，因為購物車會做數量的加減，計算總金額。


### 將產品清單渲染在畫面上
產品共 9 個，陣列中定義個別 id 、 產品名稱、圖像路徑、價格與數量。
這邊要稍微留意產品 id 從 1 號開始編號，但是陣列索引是從 0 開始算。

```javascript!
const products = [
  {
    id: 1,
    name: "桃子晶凍星冰樂",
    image: "flappuccino01.png",
    price: 155,
    quantity:1
  },
  ...(中略)
  {
    id: 9,
    name: "綿滑甜薯星冰樂",
    image: "flappuccino09.png",
    price: 130,
    quantity:1
  },
]
```

讓產品清單陣列跑`forEach()`渲染出 HTML 結構，

在產品按鈕上直接綁定 `addToCart()` 函式，並帶入該產品的索引值，

一點擊「加入購物車」按鈕，

就會比對產品清單陣列，抓到相同索引值的產品物件，將之加入購物車清單陣列之中。

```javascript!

const productWrapper = document.querySelector(".menu__content__list__wrapper");

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

}

showProduct();
```

一開始的那條 if 判斷式，
```javascript!
if(productWrapper){productWrapper.innerHTML += str}
```

意思是，先判斷畫面上有沒有`productWrapper`這個元素存在，

若有此元素存在，才把產品清單渲染上去。

因為 `productWrapper` 元素只存在於「菜單」分頁之中，如果不加入這個 if 判斷式，切換到其他分頁時會因為找不到元素可以渲染產品清單而報錯。
 
![image](https://github.com/Judy-Nihao/starbucks-demo/blob/gh-pages/assets/images/note-03.png?raw=true)




### 加入購物車的判斷

**不重複加入商品**
建立一個新物件`newObj`，物件內容是透過「深拷貝」產品清單陣列的物件而得，並且每次點擊加入購物車，就比對此商品物件 id 和購物車陣列內的產品物件 id，有沒有重複？沒有重複才可以加入購物車。

```javascript!
function addToCart(index){
    //先深拷貝物件，才不會影響到原始 products 陣列物件
    let newObj = JSON.parse(JSON.stringify(products[index]));

    //把購物車目前所有品項的 id 抽出來做一個陣列
    let mapResult = shoppingList.map(function(obj){
      return obj.id;
  }) 
    // 比對購物車 id 陣列和 新加入的商品的 id 有沒有重複
    if(!mapResult.includes(newObj.id)){
      shoppingList.push(newObj);
    }
    
    reloadShoppingCard();
};

```

**三種陣列方法**

1. 用`map()` 方法提取購物車陣列內所有物件的 id ，組成一個新的 id 陣列 `mapResult`。
2. 用`includes()` 方法檢查`mapResult`陣列內，是否含有`newObj`的 id。`includes()` 方法會回傳布林值，true or false。只有當 `mapResult.includes(newObj.id)` 結果是 false 時，才加入清單，所以要在 if 條件括號內，添加一個驚嘆號，將 false 轉成 true ，才去執行加入購物車的步驟。
3. 用`push()` 方法將`newObj`加入購物車陣列。


看似沒幾行的原始碼，其實經過一段試錯，最後才梳理出合乎邏輯不會報錯的寫法，以下列出過程中撞牆的幾點省思。

### 陣列賦值的蹊蹺01：陣列的長度計算
一開始我想的很簡單，我希望所有品項的順序都固定排好，產品清單索引0的物件，就直接對照存進購物車清單索引0的物件，所以寫成：

```javascript
// 如果購物車清單是空的就加進去
if(shoppingList[index] == null){
shoppingList[index] = products[index]; 
```

如果是照順序將`id:1`、`id:2`......`id:9`產品加入，看不出問題。

但如果一開始就加入購物車的是`id:9`的產品，印出購物車陣列後會發現，明明只加入 1 項物件，陣列長度卻顯示為 9，陣列狀態顯示為：

```javascript!
[empty × 8, {…}]
```

前面出現 8 個 empty，表示這個寫法怪怪的。

`id:9` 的產品表示他是 `products[8]`，被加入購物車後，指定放在購物車陣列「索引值8」的位置也就是`shoppingList[8]` ，陣列因而產生出索引值 0~7 的空位。這樣會導致陣列的長度計算出現錯誤，明明只有1個物件，卻回傳長度為9。

要避免產生 empty ，只要用最基礎的`push()`方法，把物件存進陣列即可，push 一個物件，陣列長度就是 1，push 兩個物件，陣列長度就是 2 ，以此類推。

```javascript!
shoppingList.push(newObj);
```


### 陣列賦值的蹊蹺02：淺拷貝與深拷貝

把 B 陣列的物件直接複製給 A 陣列，會讓複製出來物件的值，跟原本陣列物件的值，互相產生影響。

導致後面要計算金額時出現錯誤。

例如這個狀況：購物車要根據「修改後的數量」 * 「產品原始價格」計算購物總金額

```javascript!

shoppingList[index].price = quantityChanged * products[index].price;

```

`shoppingList[index].price` 是購物車中，該項產品數量增減後的產品購買總金額，

我希望拿改變過的數量 * 產品清單初始價格，算出購買總金額。

例如：桃子星冰樂定價 1 杯 150元，數量改 3 杯，預期結果是 3 * 150  = 450。

然而實際計算時發現，第一次計算，數量從 1 變成 3，得到 450 元的結果，很正常，

但接續計算，從 3 杯 改回 2 杯後，照理來說金額該是：

```
2 * 150 = 300
```

實際計算出來卻變成

```
2 * 450 = 900
```

印出產品清單陣列檢查，會發現陣列內初始價格 ` products[index].price` 被改變了！

價格已經被改成上次加乘後的結果，所以下次再計算時，價格就會越乘越大。

會發生這種狀況，就是因為當初複製陣列時的寫法，是「淺拷貝」：


```
shoppingList[index] = products[index]
```

[參考：JS 中的淺拷貝 (Shallow copy) 與深拷貝 (Deep copy) 原理與實作](https://www.programfarmer.com/articles/2021/javascript-shallow-copy-deep-copy)
> 相對地，Object data 則是僅複製地址(address)，因此值可能互相影響，這種複製出的變數與原來的變數間會互相影響的複製方法，稱為淺拷貝(shallow copy)。

> 當 Original Object data 與 Cloned Object data 中，有任何一層的資料地址相同，背後指向的值相同，兩個物件的操作會互相影響，就為淺拷貝(shallow copy)。

要斷開原始陣列和克隆陣列之間的連結，

就是要用「深拷貝」複製物件，以確保複製後的是「獨立新物件」。

透過轉譯兩次可以達到「深拷貝」：

1. 用 `JSON.stringify` 先把物件轉字串，再用 `JSON.parse` 把字串轉物件。
2. 再用 `push()` 方法把物件 push 存進去新陣列中。

```javascript!
let newObj = JSON.parse(JSON.stringify(products[index]));
shoppingList.push(newObj);
```

當時在這邊卡很久，不明白為什麼簡單的乘法計算，結果卻越來越離譜，爬文後才發現是自己當初陣列複製時，無意間採用的淺拷貝寫法在搞鬼。


### 切換頁面仍保持購物車資料：localStorage 

購物車目前只在「菜單」分頁上存在，只要一切換網站內的分頁，購物車就會被清空。

我希望即使切換分頁，購物車也能保留選購資料，模擬消費者在瀏覽網頁消費時的行為，除非自己刪除品項或是送出訂單，否則購物車的品項應該要被記錄著。

要保留的資料有 2 處，

1. 購物車清單陣列
2. 購物車 icon 上面的數字

![image](https://github.com/Judy-Nihao/starbucks-demo/blob/gh-pages/assets/images/note-04.jpeg?raw=true)

![image](https://github.com/Judy-Nihao/starbucks-demo/blob/gh-pages/assets/images/note-05.png?raw=true)

保留的意思，其實是保存當下陣列狀態或是當下的選購數字，切換分頁後，再次渲染在購物車畫面上，看起來就像是沒有變一樣。

使用 2 組 `localStorage.setItem` 和 `localStorage.getItem` 分別紀錄購物車清單陣列，和購物車 icon 數字。

保存資料時，要注意 localStorage 只能存進去純字串，所以購物車陣列存進去時，

要先透過 `JSON.stringify` 字串化，取出來要炫染畫面時，再透過 `JSON.parse()` 物件化。

localStorage 格式如下，其中的 key 是自訂的名稱，可以取任何名字。

```
localStorage.setItem(key, value)
```

**setItem**

儲存用的函式定義好之後，就在每次渲染購物車時執行一次，

把 `saveData()` 和 `saveQ()` 放在 `reloadShoppingCard()` 函式內的最後面，

每次購物車有任何渲染變動，就儲存當下陣列狀態。


```javascript!
function saveData(){
  localStorage.setItem("list", JSON.stringify(shoppingList));
}
```

```javascript!
// 這裡的 quantity變數是指購物車 icon 右上角的數字
function saveQ(){
  localStorage.setItem("counting", quantity.textContent);
}
```

**getItem**

取出資料則是先物件後，把資料存進陣列中，再渲染在畫面上。

但這邊要注意，必須先判斷 localStorage 目前有沒有資料在裡面，

比如：購物車若被清空，localStorage 沒有資料，卻要求他要取資料渲染，就會報錯。

所以先透過 if 條件判斷，只有當 localStorage 內有儲存東西才渲染，如果沒東西就不會執行後續步驟。

```javascript!
function showTask(){
    if(localStorage.getItem("list") !== null){
      shoppingList = JSON.parse(localStorage.getItem("list"));
      reloadShoppingCard();
    }
}

showTask(); // 記得一開始就要先呼叫
```

購物車 icon 也是要先判斷，icon 右上方的數字初始值是 0，最少一定會顯示 0 ，

- 如果購物數量增減後大於 0，就去 localStorage 裡面抓購物車最新產品數量，炫染數字出來。
- 如果購物車被清空了，產品數量等於 0 ，就顯示 0 。

如果沒有給這條判斷，購物車清空後，會因為抓不到資料，使右上角的數字消失，連 0 都不顯示，畫面不合理。

```javascript!
function showQ(){
  if(parseInt(quantity.textContent)>0){
    quantity.textContent =  localStorage.getItem("counting");
  }else if(parseInt(quantity.textContent) == 0){
    quantity.textContent = "0";
  }
}

showQ(); // 記得一開始就要先呼叫
```


### 行動版的調整：iPad 對於 click 事件沒反應要換成 touch 事件

為了增加使用者選購時的互動感受，「加入購物車」按鈕有添加`:active`狀態樣式，

點擊下去時會放大一下下，視覺上才有點到按鈕的感覺。

```css!
.addToCart:active{
            transform: scale(1.15);
        }
```

可是使用 iPad 查看時，發現點擊下去的時，按鈕沒有變化，一開始以為是不是 `transform` 這個樣式寫法少了前綴？還是其他地方有問題。

爬文之後發現`:active`這個偽類，在 iOS 行動裝置上必須要用 touch 事件才會觸發，

[:active pseudo-class doesn't work in mobile safari](https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari)
> On iOS, mouse events are sent so quickly that the down or active state is never received. 
Therefore, the :active pseudo state is triggered only when there is a touch event set on the HTML element

所以在一開始的產品清單 HTML 渲染上，每一個「加入購物車」按鈕上面都添加一個`ontouchstart`屬性，等於告訴瀏覽器這個按鈕要監聽 touchStart 事件。

```htmlembedded!
<button class="addToCart" ontouchstart onclick="addToCart(${index})">
```

加上 touchStar 事件後再操作 iPad 點擊就能正常出現按鈕縮放效果了。
