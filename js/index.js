var router = new Router();
router.setIndex = 'index';

router.add('index', () => checkoutLogin(gotoIndex));
router.add('active', () => checkoutLogin(gotoActive, changeArticleForLogin));
router.add('feedback', () => checkoutLogin(gotoFeedback, changeArticleForLogin));
router.add('logout', () => logout());

function gotoIndex() {
    index.checked = true;
}


function gotoActive (activeEvent = 'activitySubmitButton') {

    // 切換 活動 button
    const activeRadio = document.querySelector(`#${activeEvent}`);
    activeRadio.checked = true;

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
        $('.login').on(gotoLoginUrl);
    }
}

function checkoutLogin(success, error) {
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

    //之後接到 API 成功時，在非同步時做這件事。現在先假裝有在跑。
    showActive({
        beach: "某個海灘",
        city: "城市",
        date: "活動日期",
        location: "集合地點",
        host: "聯絡人",
        phone: "聯絡電話"
    });
})


function showActive(data) {
    const activeDetail = document.querySelector('#activeDetail');

    //tr list to table
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-striped');
    for (key in data) {
        const keyCell = document.createElement('td');
        const valueCell = document.createElement('td');
        keyCell.textContent = key;
        valueCell.textContent = data[key];

        const tr = document.createElement('tr');
        tr.appendChild(keyCell);
        tr.appendChild(valueCell);
        table.appendChild(tr);
    }
    activeDetail.innerHTML = table.outerHTML;
}
