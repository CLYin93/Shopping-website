let search = async () => {
  let res = await fetch(`/product/SearchProduct${window.location.search}`);
  let results = await res.json();
  console.log(results);

  if (typeof results != "string" && results.length != 0) {
    for (i in results) {
      document.querySelector(".searchProduct").innerHTML += `
    <a href="/singleProductPage.html?productId=${results[i].id}">
        <div class="product" data-id="${results[i].id}">
            <p>產品編號:${results[i].id}</p>
            <div class="results[i]Img">
                <img src="${
                  "./ProductImg/" + results[i].product_image
                }" alt="no_image"/>
            </div>
            <p>產品名稱:${results[i].product_name}</p>
            <p>價錢:${results[i].product_price}</p>
            <p>供應商:${results[i].product_company}</p>
        </div>
    </a>
    `;
    }
  } else
    document.querySelector(
      ".searchProduct"
    ).innerHTML += `<div> There is no any result</div>`;
};

if (window.location.search != "?keyWord=") {
  search();
} else {
  window.location.replace("/");
}
