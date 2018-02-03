var router = new Router();
router.setIndex = 'index';

router.add('index', () => checkoutLogin(gotoIndex));
router.add('active', () => checkoutLogin(gotoActive, changeArticleForLogin));
router.add('feedback', () => checkoutLogin(gotoFeedback, changeArticleForLogin));
router.add('logout', () => logout());

function checkoutLogin(success, error) {
    console.log('checkoutLogin');
    const id = localStorage.getItem('id');
    typeof success !== "function" || success();
    if (id !== null) {
        // check login ok then add
        console.log('login success');
        // $('.login').remove();
    }
    else {
        typeof error !== "function" || error();
    }
    // check login ok then remove
}


function gotoIndex() {
    index.checked = true;
}

function gotoActive (isCreateActive = true) {

    // 切換 活動 button
    const activeRadio = document.querySelector(`#isCreateButton`);
    if (activeRadio) {
        activeRadio.checked = isCreateActive;
    }


    // 換頁
    active.checked = true;
}

function gotoFeedback() {
    feedback.checked = true;
    $(window).one('load', () => {
        initReportMap();
    })
}

function logout() {
    //send logout api
    localStorage.clear(); //clear id
}

function gotoLoginUrl () {
    window.location.assign("https://hainan-api.oss.tw/api/beach/login/facebook");
}

function changeArticleForLogin () {
    const htmlLogin = `
    <h1>請先登入</h1>
    <p>成為共同關心海灘的一份子!!!</p>
    <button type="button" class="btn btn-primary login">登入</button>
    `;
    if (router.currHash() !== 'index') {
        $(`[data-section="${router.currHash()}"]`).html(htmlLogin);
        $('.login').on( 'click',gotoLoginUrl);
    }
}

$(document).ready(() => {
    router.start();
    if (router.currHash() === "") {
        router.go('index');
    }

    //if login in
    // 也許會改成用 cookie
    if (window.location.hash.search('id') !== -1) {
        const id = window.location.hash.split('/')[1].split('?id=')[1];
        //存 id
        localStorage.setItem('id', id);

        //取 token
    }
})

// $(window).on('load', () => {

    // initIndexMap();
    // initReportMap();
    // router.reload();

    //send api for data

    //if success
    //init activityData
// })

const listing = document.querySelector('#listing');
listing.addEventListener('click', () => {
    mapsList.checked = false;

})
