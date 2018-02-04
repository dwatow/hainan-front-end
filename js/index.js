var router = new Router();
router.setIndex = 'index';

router.add('index', () => checkoutLogin(gotoIndex));
router.add('active', () => checkoutLogin(gotoActive, changeArticleForLogin));
router.add('feedback', () => checkoutLogin(gotoFeedback, changeArticleForLogin));
router.add('logout', () => logout());

function checkoutLogin(success, error) {
    const id = getSid();
    typeof success !== "function" || success();
    if(id === null) {
        typeof error !== "function" || error();
    }
}


function gotoIndex() {
    index.checked = true;
}

function gotoActive(isCreateActive = true) {

    // 換頁
    active.checked = true;

    // 切換 活動 button
    const activeRadio = document.querySelector(`#isCreateButton`);
    if(activeRadio) {
        activeRadio.checked = isCreateActive;
    }

    if(isCreateActive) {
        $('#activeName').val("");
        $('#activityCity').val("選擇城市");
        $('#activityBeach').val("選擇海灘名稱");
        $('#activityLocation').val("選擇海灘分段");
        $('#activeDescription').val("活動介紹文字");
        $('#activeOwner').val("");
        $('#activeOwnerPhone').val("");
        $('#assembleDateTime').val("");
        $('#assembleLocation').val("");
        $('#assembleURL').val("");
    }
}

function gotoFeedback() {
    feedback.checked = true;
    $(window).one('load', () => {
        initReportMap();
    })
}

function logout() {
    //send logout api
    document.cookie = "";  //clear id
}

function gotoLoginUrl() {
    window.location.assign("https://hainan-api.oss.tw/api/beach/login/facebook");
}

function changeArticleForLogin() {
    let htmlText = '';
    if(router.currHash() === 'active') {
        htmlText = `<p>成為淨攤活動的一份子</p>`;
    }
    else if(router.currHash() === 'feedback') {
        htmlText = `<p>成為回報海灘環境的一份子</p>`;
    }
    const htmlLogin = `
    <h1>請先登入</h1>
    ${htmlText}
    <button type="button" class="btn btn-primary login">登入</button>
    `;
    if(router.currHash() !== 'index') {
        $(`[data-section="${router.currHash()}"]`).html(htmlLogin);
        $('.login').on('click', gotoLoginUrl);
    }
}

$(document).ready(() => {
    router.start();
    if(router.currHash() === "") {
        router.go('index');
    }

    $('.nav-item').on('click', () => {
        $('.collapse').collapse('hide');
    });
})

function getSid() {
    return document.cookie.split("=").pop();
}

function demo() {
    //只是用來單獨測試用的 API 無任何功能與它相關
    $.ajax({
        url: 'https://hainan-api.oss.tw/api/beach/testLogin',
        method: 'POST',
        dataType: 'json',
        headers: {
            'x-access-token': getSid()
        },
        data: {
            "id": "a23456432"
        }
    }).done(function (data) {
        console.log(data);
    });
}

// $(window).on('load', () => {

// initIndexMap();
// initReportMap();
// router.reload();

//send api for data

//if success
//init activityData
// })

const activeList = document.querySelector('#listing');
activeList.addEventListener('click', () => {
    mapsList.checked = false;
})
