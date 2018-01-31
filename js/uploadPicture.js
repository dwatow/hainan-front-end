let picData;
let reader;
let objurl;
const imageSelector = document.querySelector('.selectImage');
const uploadBtn = document.querySelector('.uploadImgur');
const imageStatus = document.querySelector('.imageStatus');
const previewArea = document.querySelector('.previewArea');
const previewTable = document.querySelector('.previewTable');

// uploadBtn.addEventListener('click', uploadToImgur);
imageSelector.addEventListener('change', show);

var imageX
function show(event) {
    picData = imageSelector.files[0];
    console.log(picData.size)
    if (picData.size < 10485760) {
        reader = new FileReader();
        imageX = picData;
        reader.readAsDataURL(picData);

        reader.onload = function () {
            console.log(previewArea.childElementCount)
            if (previewArea.childElementCount === 1) {
                previewArea.removeChild(previewArea.lastElementChild);
                console.log(previewArea);
            }
            let img = new Image();
            img.src = `${reader.result}`;
            previewArea.appendChild(img);//.style.backgroundImage
        };
    } else {
        window.alert('請重新選擇小於10MB的上傳照片！');
        // console.log(imageSelector.files);
        // imageStatus.innerHTML = '請重新選擇小於10MB的上傳照片！';
        previewArea.removeChild(previewArea.lastElementChild);
    }
}

function uploadToImgur(event) {
    event.preventDefault();
    const files = imageSelector.files;
    console.log(files.length)
    if (files.length === 1) {
        if (picData.size < 10485760) {
            imageStatus.innerHTML = '圖片上傳中...'
            picData = imageSelector.files[0];
            var form = new FormData();
            form.append("image", picData);

            var settings = {
                async: true,
                crossDomain: true,
                album: "CVbLU",
                url: "https://api.imgur.com/3/image",
                method: "POST",
                headers: {
                    Authorization: "Client-ID c161fabd6a0a19f"
                },
                processData: false,
                contentType: false,
                mimeType: "multipart/form-data",
                data: form
            }

            $.ajax(settings).done(function (response) {
                let responseData = JSON.parse(response)['data'];
                console.log(responseData);
                imageStatus.innerHTML = `照片上傳成功！ <a href = ${responseData['link']} target="_blank">${responseData['link']}</a>`;
            });
        } else {
            window.alert('請重新選擇小於10MB的上傳照片！');
        };
    } else {
        window.alert('請先選擇照片！');
    }
}
