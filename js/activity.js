let activitykData;


const activityCityFilter = document.querySelector('#activityCity');
activityCityFilter.addEventListener('change', addActivityBeachOption);

function addActivityBeachOption(event) {
    console.clear();
    clearActivityBeachOption();
    clearActivityLocationOption();
    let activityCity = this.value;
    let activityBeach = allBeachData.filter(function (beach) {
        return beach.city.includes(activityCity);
    })
    // console.table(activityBeach)

    let activityBeachArray = [];
    activityBeach.forEach(function (beach) {
        if (activityBeachArray.includes(beach.beachName) === false) {
            activityBeachArray.push(beach.beachName);
            createActivityBeachOption(beach.beachName);
        }
    })
};

const activityBeachFilter = document.querySelector('#activityBeach');

function createActivityBeachOption(beachName) {
    // console.log(beachName)
    let newOption = document.createElement('option');
    newOption.setAttribute('value', beachName);
    newOption.textContent = beachName;
    activityBeachFilter.appendChild(newOption);
}

function clearActivityBeachOption() {
    while (activityBeachFilter.childNodes[0]) {
        activityBeachFilter.removeChild(activityBeachFilter.childNodes[0]);
    }
    activityBeachFilter.innerHTML = `<option selected disabled hidden>選擇海灘分段</option>`;
}

activityBeachFilter.addEventListener('change', addActivityLocationOption);
const activityLocationFilter = document.querySelector('#activityLocation');

function addActivityLocationOption(event) {
    clearActivityLocationOption()
    let currentActivityBeach = this.value;
    let activityLocationList = allBeachData.filter(function (beach) {
        return beach.beachName.includes(currentActivityBeach);
    })
    console.table(activityLocationList)
    // console.table(locationList);
    let activityLocationArray = [];
    activityLocationList.forEach(function (location) {
        if (activityLocationArray.includes(location.title) === false) {
            activityLocationArray.push(location.title);
            createLocationFilterOption(location.title);
        }
    })
}
function createLocationFilterOption(locationName) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', locationName);
    newOption.textContent = locationName;
    activityLocationFilter.appendChild(newOption);
}

function clearActivityLocationOption() {
    while (activityLocationFilter.childNodes[0]) {
        activityLocationFilter.removeChild(activityLocationFilter.childNodes[0]);
    }
    activityLocationFilter.innerHTML = `<option selected disabled hidden>選擇海灘分段</option>`;
}

activityLocationFilter.addEventListener('change', selectActivityPosition);


function selectActivityPosition(event) {
    console.clear();
    let currentActivityLocation = this.value;
    let selectActivityLocation = allBeachData.filter( function (position) {
        return position.title.includes(currentActivityLocation);
    })
    activityData = selectActivityLocation[0];
    console.log(activityData);
}

const activitySubmitBotton = document.querySelector('.activitySubmit');
activitySubmitBotton.addEventListener('click', checkActivity);


const activityName = document.querySelector('#activeName');
const activityDescription = document.querySelector('#activeDescription');
const activityOwner = document.querySelector('#activeOwner');
const activityOwnerPhone = document.querySelector('#activeOwnerPhone');
const assembleDate = document.querySelector('#assembleDateTime');
const assembleLocation = document.querySelector('#assembleLocation');

function checkActivity () {
    if (activityName.value === "") {
        window.alert('請輸入活動名稱！');

    } else if (activityLocationFilter.value === "選擇海灘分段") {
        window.alert('請選擇淨灘海岸！');

    } else if (activityDescription.value === "") {
        window.alert('請輸入淨灘活動相關敘述！');

    } else if (activityOwner.value === "") {
        window.alert('請輸入淨灘活動聯絡人！');

    } else if (activityOwnerPhone.value === "") {
        window.alert('請輸入淨灘活動聯絡人電話！');

    } else if (assembleDate.value === "") {
        window.alert('請輸入淨灘活動日期！');

    } else if (assembleLocation.value === "") {
        window.alert('請輸入淨灘集合地點！');

    } else {
        submitActivity();
    }
}

function submitActivity () {
    console.log('submit');
}
