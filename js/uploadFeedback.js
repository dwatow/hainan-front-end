let picData;
let reader;
let objurl;
const imageSelector = document.querySelector('.selectImage');
// const uploadBtn = document.querySelector('.uploadImgur');
// const imageStatus = document.querySelector('.imageStatus');
const previewArea = document.querySelector('.previewArea');
// const previewTable = document.querySelector('.previewTable');

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
        if (previewArea.childElementCount === 1) {
            previewArea.removeChild(previewArea.lastElementChild);
        }
    }
}

let reportBase;
const reportSubmit = document.querySelector('.reportSubmit');
reportSubmit.addEventListener('click', submitReport);

// let testReport = {
//     "targetID": 3,
//     "description": "黃金海岸需要淨灘",
//     "imageURL": "https://i.imgur.com/FZIV7sy.jpg",
//     "isOpen": "1"
// }

function submitReport(event) {

    event.preventDefault();
    if (feedbackLocationFilter.value !== '選擇海灘分段') {
        const files = imageSelector.files;
        if (files.length === 1) {
            if (picData.size < 10485760) {
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

                $.blockUI({
                    message: '<h1>資料上傳中...</h1>',
                    css: {
                        border: 'none',
                        padding: '15px',
                        backgroundColor: '#000',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px',
                        opacity: .7,
                        color: '#fff'
                    }
                });

                $.ajax(settings).done(function (response) {
                    let responseData = JSON.parse(response)['data'];
                    let url = responseData.link;
                    uploadToServer(url);
                });
            } else {
                window.alert('請重新選擇小於10MB的上傳照片！');
            };
        } else {
            window.alert('請先選擇照片！');
        }
    } else {
        window.alert('請先選擇回報地點！')
    }

}

const feedbackDescription = document.querySelector('#feedbackDescription');

function uploadToServer(url) {
    let cleanStatus = document.querySelector('input[name="cleanRequire"]:checked').value;

    let feedbackReport = {
        "targetID": feedbackData.id,
        "description": feedbackDescription.value,
        "imageURL": url,
        "beachClean": cleanStatus,
    }

    console.table(feedbackReport)

    $.ajax({
        //settings
        url: 'https://hainan-api.oss.tw/api/beach/notification',
        type: 'POST',
        data: feedbackReport,
        dataType:'json',
        //handles response
        success(response) {
            console.log(response.result);
            $.unblockUI();
            window.alert('上傳成功！')
            window.location.assign("https://hainan.oss.tw/#!index");
        },
        error(jqXHR, status, errorThrown) {
            console.log(jqXHR);
        }
    });
}