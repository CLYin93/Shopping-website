async function clientSideGetCategoryProducts() {
  let currentCategory = new URLSearchParams(window.location.search);
  let currentCategoryId = currentCategory.get("categoriesId");
  const categoryProducts = await (
    await fetch(`/product/productPage/${currentCategoryId}`)
  ).json();

  for (const categoryProduct of categoryProducts) {
    document.querySelector(".categoryProducts").innerHTML +=
      /*html*/
      `
            <a href="/singleProductPage.html?productId=${categoryProduct.id}">
                <div class="product" data-id="${categoryProduct.id}">
                    <p>產品編號:${categoryProduct.id}</p>
                    <div class="categoryProductImg">
                        <img src="./ProductImg/${categoryProduct.product_image}" alt=no_image/>
                    </div>
                    <p>產品名稱:${categoryProduct.product_name}</p>
                    <p>價錢:${categoryProduct.product_price}</p>
                    <p>供應商:${categoryProduct.product_company}</p>
                </div>
            </a>
            `;
  }
}

clientSideGetCategoryProducts();
