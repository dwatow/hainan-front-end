var router = new Router();
router.add('index', () => gotoIndex())
router.add('active', () => gotoActive())
router.add('feedback', () => gotoFeedback())
router.add('logout', () => logout())

function gotoIndex() {
    index.checked = true;
    // $(window).one('load', () => {
    //     initIndexMap();
    // })
}

function gotoActive () {
    checkoutLogin(() => {
        active.checked = true
    })
}

function gotoFeedback() {

    checkoutLogin(() => {
        feedback.checked = true;
        $(window).one('load', () => {
            initReportMap();
        })
    })
}

function logout() {
    //send logout api
    localStorage.clear(); //clear id
}

function checkoutLogin(success) {
    const id = localStorage.getItem('id');
    if (id === null) {
        // window.location.assign("https://hainan-api.oss.tw/api/beach/login/facebook");
    }
    else {
        // check login ok then add
        // success();
    }
    // check login ok then remove
    console.log('success');
    $('.login').remove();
    success();
}

$(document).ready(() => {
    if (window.location.hash.search('id') !== -1) {
        const id = window.location.hash.split('/')[1].split('?id=')[1];
        //存 id
        localStorage.setItem('id', id);

        //取 token
    }
    router.start();
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
