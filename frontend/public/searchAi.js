// The buttons to start & stop stream and to capture the image
let btnStart = document.getElementById("btn-start");
let btnStop = document.getElementById("btn-stop");
let btnCapture = document.getElementById("btn-capture");

// The stream & capture
let stream = document.getElementById("stream");
let capture = document.getElementById("capture");
let snapshot = document.getElementById("snapshot");

// The video stream
let cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
btnCapture.addEventListener("click", captureSnapshot);

// Start Streaming
function startStreaming() {
  

  let mediaSupport = "mediaDevices" in navigator;

  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 420, height: 620 } })
      .then(function (mediaStream) {
        cameraStream = mediaStream;

        stream.srcObject = mediaStream;

        stream.play();
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
      });
  } else {
    alert("Your browser does not support media devices.");

    return;
  }
}

// Stop Streaming
function stopStreaming() {
  if (null != cameraStream) {
    var track = cameraStream.getTracks()[0];

    track.stop();
    stream.load();

    cameraStream = null;
  }
}

async function captureSnapshot() {
  document.querySelector(".searchProduct").innerHTML = "";
  if (null != cameraStream) {
    let ctx = capture.getContext("2d");
    let img = new Image();

    ctx.drawImage(stream, 0, 0, capture.width, capture.height);

    img.src = capture.toDataURL("image/jpeg");

    let imgBase64 = img.src;

    const file = DataURIToBlob(imgBase64);

    const formData = new FormData();
    formData.append("upload", file, "image.jpg");
    // formData.append('profile_id', this.profile_id) //other param
    // formData.append('path', 'temp/') //other param

    function DataURIToBlob(dataURI) {
      const splitDataURI = dataURI.split(",");
      const byteString =
        splitDataURI[0].indexOf("base64") >= 0
          ? atob(splitDataURI[1])
          : decodeURI(splitDataURI[1]);
      const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i);

      return new Blob([ia], { type: mimeString });
    }

    let res = await fetch("/ai/uploadimg", {
      method: "POST",
      body: formData,
    });

    let results = await res.json();
    //  console.log(res); //   AI result
    console.log(results);

    if (typeof results != 'undefined') {
      //  let searchres = await fetch(`/product/SearchProduct${res}`);
      //   let results = await searchres.json();
      //   console.log(results);

      if (typeof results.description != 'undefined'){
        return document.querySelector(".searchProduct").innerHTML += "no results";
      }


      
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
    } else {
      document.querySelector(".searchProduct").innerHTML += "no results";
      // window.location.replace("/");
    }

    //  uploadimg.appendChild( img );
    //  let image_data_url = document.querySelector("#canvas").toDataURL('image/jpeg');
  }
}
