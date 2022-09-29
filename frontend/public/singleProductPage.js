//get product information
let currentProduct = new URLSearchParams(window.location.search);
let currentProductId = currentProduct.get("productId");
//get product information

//get product
async function clientSideGetSingleProduct() {
  const product = await (
    await fetch(`/product/productDetailInfo/${currentProductId}`)
  ).json();
  const productInfo = product[0];
  document.querySelector(".product").innerHTML =
    /*html */
    `
    <div id="productSection1">
        <div class="productSection1SubSection">
            <div class="productImg">
                <p>產品編號:${productInfo.id}</p>
                <img src="${
                  "./ProductImg/" + productInfo.product_image
                }" alt="no_image"/>   
            </div>
        </div>
        <div id="productInfo">
            <p>產品名稱:${productInfo.product_name}</p>
            <p>價錢:${productInfo.product_price}</p>
            <p>供應商:${productInfo.product_company}</p>
        </div>
        <div id="productPurchase">
        </div>
        <div id='addCollection'>
        </div>
    </div>
    <div id="productSection2">
        <p>產品詳情:${productInfo.product_content}</p>
    </div>
    `;
}

//showbought is for the development status which login system is incompleted

async function checkClientCartProduct() {
  //confirm is product bought
  const boughtProductNum = await (
    await fetch(`/cart/showThisProductVolume/${currentProductId}`)
  ).json();
  //confirm is product bought
  const singleProductPriceInfo =
    document.querySelector("#productInfo").childNodes[3].innerHTML;
  const singleProductPrice = singleProductPriceInfo.replace(/^\D+/g, "");
  document.querySelector("#productPurchase").innerHTML =
    /*html */
    `
     <button id="notPurchased" class="addToCart btn btn-success">加入購物車</button>
     
     <div id="purchased">
        <div id="AmountOfBoughtProduct">
            購物車內已有${boughtProductNum}件同樣產品
        </div>
        <div id="thisProductPrice">此產品總價:$${
          parseInt(singleProductPrice) * boughtProductNum
        }</div>
        <div class="addOrMinusOneToCart">
            <button class="addToCart btn btn-primary">購買量+1</button>
            <button class="minusToCart btn btn-danger">購買量-1</button>
        <div>
     </div>
        `;

  if (boughtProductNum == 0) {
    document.querySelector("#purchased").classList.add("noshow");
    document.querySelector("#notPurchased").classList.remove("noshow");
  } else {
    document.querySelector("#purchased").classList.remove("noshow");
    document.querySelector("#notPurchased").classList.add("noshow");
  }

  //add to cart
  let allAddTocartBtn = document.querySelectorAll(".addToCart");
  for (let addTocartBtn of allAddTocartBtn) {
    addTocartBtn.addEventListener("click", async () => {
      const singleProductPriceInfo =
        document.querySelector("#productInfo").childNodes[3].innerHTML;
      const singleProductPrice = singleProductPriceInfo.replace(/^\D+/g, "");
      let addSuccessfully = await (
        await fetch("/cart/addCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: currentProductId }),
        })
      ).json();
      let newPurchaseNum = addSuccessfully.thisProductVolume;
      document.querySelector("#purchased").classList.remove("noshow");
      document.querySelector("#notPurchased").classList.add("noshow");
      document.querySelector("#AmountOfBoughtProduct").innerHTML = `
            購物車內已有${newPurchaseNum}件同樣產品
            `;

      document.querySelector("#thisProductPrice").innerHTML = `
            此產品總價:$${parseInt(singleProductPrice) * newPurchaseNum}
            `;
    });
    //add to cart
  }

  //minus to cart
  document.querySelector(".minusToCart").addEventListener("click", async () => {
    const singleProductPriceInfo =
      document.querySelector("#productInfo").childNodes[3].innerHTML;
    const singleProductPrice = singleProductPriceInfo.replace(/^\D+/g, "");
    let minusSuccessfully = await (
      await fetch("/cart/decrementCart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: currentProductId }),
      })
    ).json();
    let newPurchaseNum = minusSuccessfully.thisProductVolume;
    if (newPurchaseNum == 0) {
      document.querySelector("#purchased").classList.add("noshow");
      document.querySelector("#notPurchased").classList.remove("noshow");
    } else {
      document.querySelector("#AmountOfBoughtProduct").innerHTML = `
            購物車內已有${newPurchaseNum}件同樣產品
            `;
      document.querySelector("#thisProductPrice").innerHTML = `
            此產品總價:$${parseInt(singleProductPrice) * newPurchaseNum}
            `;
    }
  });
  //minus to cart
}

let checkCollection = async () => {
  let res = await fetch("/user/collection");
  let data = await res.json();
  if (data[0].id == currentProductId) {
    document.querySelector("#addCollection").innerHTML =
      /*html*/
      `
    <button class='collectionButton btn btn-secondary'>已收藏</button>
    `;
  } else {
    document.querySelector("#addCollection").innerHTML =
      /*html*/
      `
  <button class='collectionButton btn btn-secondary'>加入收藏</button>
  `;
  }
  document.querySelector(".collectionButton").addEventListener("click", (e) => {
    if (document.querySelector(".collectionButton").innerHTML == "加入收藏") {
      let res = fetch("/user/collection", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: currentProductId }),
      });
      e.target.innerHTML = "已收藏";
    } else {
      let res = fetch("/user/collection", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: currentProductId }),
      });
      e.target.innerHTML = "加入收藏";
    }
  });
};

async function checkLogin() {
  const login = await (await fetch(`/user/isLogin`)).json();
  if (login) {
    checkClientCartProduct();
    checkCollection();
  }
}

clientSideGetSingleProduct();
checkLogin();
