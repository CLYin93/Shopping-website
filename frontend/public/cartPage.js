async function showCartProduct() {
  //Check is any cart product first
  let cartProducts = await (await fetch(`/cart/viewCart`)).json();
  //Check is any cart product first
  document.querySelector(".cartProducts").innerHTML = "";
  //No cart product message
  if (cartProducts == "You do not have product in cart") {
    document.querySelector(
      ".cartProducts"
    ).innerHTML = `<div>${cartProducts}</div>`;
    document.querySelector("#priceCalculatorInfo").classList.add("noshow");
    //No cart product message

    //There are cart product
  } else {
    //Show all cart product
    for (let cartProduct of cartProducts) {
      document.querySelector(".cartProducts").innerHTML +=
        /*html*/
        `
            <li id="product${
              cartProduct.id
            }" class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                    <div class="fw-bold">${cartProduct.product_name}</div>
                    <div class="cartPorductBasicInfo">
                        <p>產品編號:${cartProduct.id}</p>
                        <p>價格:${cartProduct.product_price}x${
          cartProduct.product_volume
        }=$${cartProduct.product_price * cartProduct.product_volume}</p>
                    </div>
                </div>
                <button id="removeAllOfThisProduct${
                  cartProduct.id
                }" class = 'btn-close'></button>
                <a href="/singleProductPage.html?productId=${
                  cartProduct.id
                }">繼續查看此產品</a>
            </li>
            `;
    }
    //Show all cart product

    //price calculator
    let priceCalculatorInfo = await (await fetch(`/cart/totalCost`)).json();

    let totalCost = priceCalculatorInfo.totalCost;
    let deliveryFee = priceCalculatorInfo.deliveryFee;
    let totalOrder = priceCalculatorInfo.totalOrder;
    let gap = priceCalculatorInfo.gap;
    document.querySelector(".totalCost").innerHTML = `${totalCost}`;
    document.querySelector(".deliveryFee").innerHTML = `${deliveryFee}`;
    document.querySelector(".totalOrder").innerHTML = `${totalOrder}`;
    document.querySelector("#gap").innerHTML = `${gap}`;
    document.querySelector(".fulfilTotalCost").innerHTML = `${totalCost + gap}`;
    if (gap == 0) {
      document.querySelector(".newTotalOrder").innerHTML = `${totalOrder}`;
    } else {
      document.querySelector(".newTotalOrder").innerHTML = `${totalCost + gap}`;
    }
    //calculator

    //cartRemoveControl
    for (let cartProduct of cartProducts) {
      document
        .querySelector(`#removeAllOfThisProduct${cartProduct.id}`)
        .addEventListener("click", async () => {
          //Remove a cart from database
          let isCartRemoveReply = await (
            await fetch("/cart/removeCart", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ product_id: cartProduct.id }),
            })
          ).json();
          //Remove a cart from database

          //Refresh the price calculator
          let priceCalculatorInfo = await (
            await fetch(`/cart/totalCost`)
          ).json();

          let totalCost = priceCalculatorInfo.totalCost;
          let deliveryFee = priceCalculatorInfo.deliveryFee;
          let totalOrder = priceCalculatorInfo.totalOrder;
          let gap = priceCalculatorInfo.gap;
          document.querySelector(".totalCost").innerHTML = `${totalCost}`;
          document.querySelector(".deliveryFee").innerHTML = `${deliveryFee}`;
          document.querySelector(".totalOrder").innerHTML = `${totalOrder}`;
          document.querySelector("#gap").innerHTML = `${gap}`;
          document.querySelector(".fulfilTotalCost").innerHTML = `${
            totalCost + gap
          }`;
          if (gap == 0) {
            document.querySelector(
              ".newTotalOrder"
            ).innerHTML = `${totalOrder}`;
          } else {
            document.querySelector(".newTotalOrder").innerHTML = `${
              totalCost + gap
            }`;
          }
          //Refresh the price calculator

          //Message that no cart product anymore after removing
          let cartProducts = await (await fetch(`/cart/viewCart`)).json();
          if (cartProducts == "You do not have product in cart") {
            document
              .querySelector("#priceCalculatorInfo")
              .classList.add("noshow");
            document.querySelector(
              ".cartProducts"
            ).innerHTML = `<div>${cartProducts}</div>`;
          }
          //Message that no cart product anymore after removing

          //Remove product from frontend
          if (isCartRemoveReply) {
            document.querySelector(`#product${cartProduct.id}`).remove();
          }
          //Remove product from frontend
        });
    }

    //cartRemoveControl
  }
  //There are cart product
}

async function showClientBill() {
  const clientBillsHistory = await (await fetch("/cart/showInvoice")).json();
  document.querySelector("#clientBills").innerHTML = "";
  for (const clientBillHistory of clientBillsHistory) {
    let deliveryFeeDisplay;
    if (clientBillHistory.deliveryFeeDiscount) {
      deliveryFeeDisplay = "(免費)";
    } else {
      deliveryFeeDisplay = "(包含)";
    }
    document.querySelector("#clientBills").innerHTML += `
        <div id="bill${clientBillHistory.id}" class="bill">
            <button id="removeBill${clientBillHistory.id}" class="removeThisBill">X</button>
            <div>
                <p>單據編號:${clientBillHistory.id}</p>
                <p>送貨地址:${clientBillHistory.user_delivery_address}</p>
                <p>送貨費用:${deliveryFeeDisplay}</p>
                <div class="billProduct${clientBillHistory.id}">

                </div>
                <p>此單貨品總值:$${clientBillHistory.total_order}</p>
            </div>
            <div id="bill${clientBillHistory.id}Status">

            </div>
        </div>
        `;
    for (let billProduct of clientBillHistory.products) {
      document.querySelector(
        `.billProduct${clientBillHistory.id}`
      ).innerHTML += `
            <div>${billProduct.product_name}x${billProduct.product_volume}</div
            `;
    }
  }
  //check paid or unpaid
  for (const clientBillHistory of clientBillsHistory) {
    if (clientBillHistory.invoice_status == "unpaid") {
      document.querySelector(`#bill${clientBillHistory.id}Status`).innerHTML = `
            <form method="POST" action="/cart/pay">
                <input type="hidden" name="invoiceId" value="${clientBillHistory.id}">
                <input id="bill${clientBillHistory.id}PayBtn" class="billPayBtn" type="submit" value="付款">
            </form>
            `;
    } else {
      document.querySelector(`#bill${clientBillHistory.id}Status`).innerHTML =
        "Paid";
    }
  }
  //check paid or unpaid

  //payment

  //payment

  for (const clientBillHistory of clientBillsHistory) {
    document
      .querySelector(`#removeBill${clientBillHistory.id}`)
      .addEventListener("click", async () => {
        //Remove a bill from database
        let isBillRemoveReply = await (
          await fetch("/cart/removeInvoice", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoice_id: clientBillHistory.id }),
          })
        ).json();
        //Remove a bill from database

        //Remove bill from frontend
        if (isBillRemoveReply) {
          document.querySelector(`#bill${clientBillHistory.id}`).remove();
        }
        //Remove bill from frontend
      });
  }
}

//checkOut
document.querySelector("#checkOut").addEventListener("click", async () => {
  checkReply = await (await fetch(`/cart/checkOut`)).json();
  if (checkReply == "Do not have product in cart") {
    document.querySelector("#addCartReminder").classList.remove("noshow");
    setTimeout(() => {
      document.querySelector("#addCartReminder").classList.add("noshow");
    }, 2000);
  }

  showClientBill();
});
//checkOut

async function checkLoginForShowCartProduct() {
  const login = await (await fetch(`/user/isLogin`)).json();
  if (login) {
    showCartProduct();
  }
}

checkLoginForShowCartProduct();

showClientBill();
