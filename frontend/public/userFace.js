// document.querySelector().addEventListener("submit", async function (event) {
//   event.preventDefault();

//   // Serialize the Form afterwards
//   const form = event.target;
//   const formObject = {};
//   formObject["firstName"] = form.acount.value;
//   formObject["lastName"] = form.lastName.value;
//   formObject["email"] = form.email.value;
//   formObject[""] = form.description.value;
//   const res = await fetch("/contact", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formObject),
//   });
//   const result = await res.json();
//   document.querySelector("#contact-result").innerHTML = result;
// });

// document.querySelector('#showAccountData').addEventListener('click', async()=> {
//   const res = await fetch("/user/userInfo");
//   const userData = await res.json();
//   const userPersonalInfo = userData[0][0]
//   document.querySelector('#username').innerHTML = `${userPersonalInfo.user_name}`
//   document.querySelector('#MF').innerHTML = `${userPersonalInfo.user_gender}`
//   document.querySelector('#mailAdress').innerHTML = `${userPersonalInfo.user_email}`
// })

async function getUserData() {
  const res = await fetch("/user/userInfo");
  const userData = await res.json();
  const userPersonalInfo = userData[0][0];
  //   console.log(userPersonalInfo);
  document.querySelector(".account").innerHTML += `
 <h2>帳戶資料</h2>
    <form class = 'userInfo'>
            <div>用戶名稱:</div><input name='userName' type= 'text' value='${userPersonalInfo.user_name}'>
            <div>性別: </div><input name='gender' type= 'text' value='${userPersonalInfo.user_gender}'>
            <div>聯絡電郵地址:</div><input name='email' type= 'text' value='${userPersonalInfo.user_email}'>
            <div>聯絡電話:</div> <input name='phoneNumber' type= 'text' value='${userPersonalInfo.phone_number}'> 
            <button class="btn btn-outline-success" type="submit">Save</button>
    </form>
    `;
  document.querySelector(".userInfo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;

    const formObject = {};
    formObject["email"] = form.email.value;
    formObject["userName"] = form.userName.value;
    formObject["phoneNumber"] = form.phoneNumber.value;
    formObject["gender"] = form.gender.value;

    const editRes = await fetch("/user/userInfo", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });
    const isUpdate = await editRes.json();

    if (isUpdate.isUpdate) {
      document.querySelector(".updatedResult").innerHTML =
        "Successfully Update";
      document.querySelector(".updatedResult").classList.remove("noShow");
    }
    setTimeout(() => {
      document.querySelector(".updatedResult").classList.add("noShow");
    }, 2000);
  });
}
getUserData();
