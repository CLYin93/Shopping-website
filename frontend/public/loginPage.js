let isLogin = async () => {
  let res = await fetch("/user/isLogin");
  let isLogin = await res.json();
  if (isLogin) {
    const userInfo = await (await fetch("/user/userInfo")).json();
    const userName = userInfo[0][0].user_name;
    document.querySelector(".login").classList.add("logout");
    document.querySelector(".logout").classList.remove("login");
    document.querySelector(".logout").innerHTML = `已登入為${userName}`;
    document.querySelector("#userData").classList.remove("noshow");
    document.querySelector("#collection").classList.remove("noshow");
    document.querySelector(".logout").addEventListener("click", async () => {
      let logoutStatus = await fetch("/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      document
        .querySelector(".logout")
        .replaceWith(document.querySelector(".logout").cloneNode(true));
      const logoutRespone = await logoutStatus.json();
      const logoutReply = logoutRespone.result;
      console.log(logoutReply);

      document.querySelector("#loginAndResgisterReport").innerHTML =
        logoutReply;
      document
        .querySelector("#loginAndResgisterReport")
        .classList.remove("noshow");
      setTimeout(() => {
        document
          .querySelector("#loginAndResgisterReport")
          .classList.add("noshow");
      }, 2000);

      document.querySelector(".logout").classList.add("login");
      document.querySelector(".login").classList.remove("logout");
      document.querySelector(".login").innerHTML = "登入/註冊";
      document.querySelector(".login").addEventListener("click", () => {
        document
          .querySelector(".loginResgisterPage")
          .classList.remove("noshow");
      });
      setTimeout(() => {
        location.replace("/");
      }, 2000);
    });
  }
};
isLogin();

document.querySelector(".login").addEventListener("click", () => {
  document.querySelector(".loginResgisterPage").classList.remove("noshow");
});

document.querySelector(".getOutLoginPage").addEventListener("click", () => {
  document.querySelector(".loginResgisterPage").classList.add("noshow");
});

//resgister form
document
  .querySelector("#resgisterForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};
    formObject["account"] = form.account.value;
    formObject["password"] = form.password.value;
    const res = await fetch("/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });
    //resgister report
    const Status = await res.json();
    const resgisterStatus = Status.result;
    document.querySelector("#loginAndResgisterReport").innerHTML =
      resgisterStatus;
    document.querySelector(".getOutLoginPage").addEventListener("click", () => {
      document.querySelector(".loginResgisterPage").classList.add("noshow");
    });
    document
      .querySelector("#loginAndResgisterReport")
      .classList.remove("noshow");
    document.querySelector('.loginInfor input[type="userName"]').value = "";
    document.querySelector('.loginInfor input[type="password"]').value = "";
    setTimeout(() => {
      document
        .querySelector("#loginAndResgisterReport")
        .classList.add("noshow");
    }, 2000);
    //resgister report
  });
//resgister form

//login form
document
  .querySelector("#loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Serialize the Form afterwards
    const form = event.target;
    const formObject = {};
    formObject["account"] = form.account.value;
    formObject["password"] = form.password.value;
    const res = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    //login report
    const Status = await res.json();
    const loginStatus = Status.result;
    document.querySelector("#loginAndResgisterReport").innerHTML = loginStatus;
    document.querySelector(".getOutLoginPage").addEventListener("click", () => {
      document.querySelector(".loginResgisterPage").classList.add("noshow");
    });
    document.querySelector(".loginResgisterPage").classList.add("noshow");
    document
      .querySelector("#loginAndResgisterReport")
      .classList.remove("noshow");
    setTimeout(() => {
      document
        .querySelector("#loginAndResgisterReport")
        .classList.add("noshow");
    }, 2000);
    //login report

    //logout configuration after login successful
    if (loginStatus == "successful login") {
      const userInfo = await (await fetch("/user/userInfo")).json();
      const userName = userInfo[0][0].user_name;
      document.querySelector("#userData").classList.remove("noshow");
      document.querySelector(".login").classList.add("logout");
      document.querySelector(".logout").classList.remove("login");
      document.querySelector(".logout").innerHTML = `已登入為${userName}`;
      document.querySelector(".logout").addEventListener("click", async () => {
        let logoutStatus = await fetch("/user/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        document
          .querySelector(".logout")
          .replaceWith(document.querySelector(".logout").cloneNode(true));
        const logoutRespone = await logoutStatus.json();
        const logoutReply = logoutRespone.result;
        console.log(logoutReply);

        document.querySelector("#loginAndResgisterReport").innerHTML =
          logoutReply;
        document
          .querySelector("#loginAndResgisterReport")
          .classList.remove("noshow");
        setTimeout(() => {
          document
            .querySelector("#loginAndResgisterReport")
            .classList.add("noshow");
        }, 2000);

        document.querySelector(".logout").classList.add("login");
        document.querySelector(".login").classList.remove("logout");
        document.querySelector(".login").innerHTML = "登入/註冊";
        document.querySelector(".login").addEventListener("click", () => {
          document
            .querySelector(".loginResgisterPage")
            .classList.remove("noshow");
        });
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      });
      setTimeout(() => {
        window.location.replace(`${window.location.href}`);
      }, 2000);
    }

    //logout configuration after login successful
  });
//login form
