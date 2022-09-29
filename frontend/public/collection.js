let collection = async () => {
  let res = await fetch("/user/collection");
  let theCollection = await res.json();
  console.log(theCollection);
  if (typeof theCollection != "string") {
    for (i in theCollection) {
      document.querySelector(".productList").innerHTML +=
        /*html*/
        `
    <a href="/singleProductPage.html?productId=${theCollection[i].id}">
        <div class="product" data-id="${theCollection[i].id}">
        <button data-id = "${theCollection[i].id}">X</button>
            <p>產品編號:${theCollection[i].id}</p>
            <div class="theCollection[i]Img">
                <img src="${
                  "./ProductImg/" + theCollection[i].product_image
                }" alt="no_image"/>
            </div>
            <p>產品名稱:${theCollection[i].product_name}</p>
            <p>價錢:${theCollection[i].product_price}</p>
            <p>供應商:${theCollection[i].product_company}</p>
        </div>
    </a>
    `;
    }
  } else
    document.querySelector(
      ".productList"
    ).innerHTML += `<div> You don't have any collection </div>`;

  let delButtons = document.querySelectorAll(".productList button");
  for (const delButton of delButtons) {
    delButton.addEventListener("click", async (e) => {
      e.preventDefault();

      let res = await fetch(`/user/collection/`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: delButton.dataset.id }),
      });
      window.location.replace("/collection.html");
    });
  }
};
collection();
