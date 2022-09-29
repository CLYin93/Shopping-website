async function getTop9heatSell() {
  let top9heatSaleProduct = await (await fetch(`/product/heatSellProduct`)).json();

  top9heatSaleProduct.map((product) => {
    return (document.querySelector(".heatSaleProducts").innerHTML += `
      <a class="card product" style="width: 30%;" href="/singleProductPage.html?productId=${product.id}">
        <img src=${"./ProductImg/" + product.product_image}
          class="card-img-top heatSaleProductImg" alt="no_image">
        <div class="card-body">
          <h5 class="card-title">${product.id}</h5>
          <p class="card-text">產品名稱:${product.product_name}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">價錢:${product.product_price}</li>
          <li class="list-group-item">供應商:${product.product_company}</li>
        </ul>
      </a>
`);
  });

}

getTop9heatSell()


//heat sales product of home page

//recommanded products
//<a href="http://127.0.0.1:5500/frontend/public/singleProductPage.html">
//get product

//get product

let recommandedProduct = [
  {id:1,
   product_image:"device01.JPG",
   product_name:"ROG Strix RTX 30",
   product_price:48763,
   product_company:"快極有限公司",
  },
  {
    id:6,
   product_image:"device05.JPG",
   product_name:"Iphone Fixer",
   product_price:9413,
   product_company:"Chi Zo Sin limit Company",
  },
  {
    id:5,
   product_image:"petMask.jpg",
   product_name:"3D Reusable MaskBlack",
   product_price:120,
   product_company:"DET20",
  }
]


recommandedProduct.map((product) => {
  return (document.querySelector(".recommandedProducts").innerHTML += `
    <a href="/singleProductPage.html?productId=${product.id}">
      <div class="card product" style="width: 300px;">
        <img src=${"./ProductImg/" + product.product_image} 
        class="card-img-top heatSaleProductImg" alt="no_image">
        <div class="card-body">
          <h5 class="card-title">${product.id}</h5>
          <p class="card-text">產品名稱:${product.product_name}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">價錢:${product.product_price}</li>
          <li class="list-group-item">供應商:${product.product_company}</li>
        </ul>
      </div>
    </a>
  `);
});
//recommanded products
