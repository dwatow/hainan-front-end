
let reportMarker;
let reportMap;
let feedbackInfoWindow;

let currentFeedbackPosition;
let feedbackData;

const feedbackPage = document.querySelector('.feedbackPage');
feedbackPage.addEventListener('click', loadFeedbackMap);
function loadFeedbackMap() {
    window.addEventListener('hashchange', initReportMap, { once: true });
}

// window.addEventListener('hashchange', initReportMap);

function initReportMap() {
    // console.log(currentPosition);
    if (currentFeedbackPosition === undefined) {
        reportMap = new google.maps.Map(document.getElementById('reportMap'), {
            center: { lat: 24.3, lng: 120.51 },
            zoom: 6,
            center: { lat: 23.5, lng: 121 },
            fullscreenControl: false,
            streetViewControl: false,
        });
    } else {
        reportMap.setCenter(currentFeedbackPosition);
        reportMap.setZoom(16) 
    }
}

function showFeedbackWindow() {
    let currentMarker = this;
    let currentPositionText = currentMarker.getPosition().toString();
    currentFeedbackPosition = currentMarker.getPosition().toJSON();
    reportCurrentPosition = currentFeedbackPosition;
    console.log(currentFeedbackPosition);
    infoWindow.open(map, marker);
}

const feedbackCityFilter = document.querySelector('#feedbackCity');
feedbackCityFilter.addEventListener('change', addBeachOption);

function addBeachOption(event) {
    console.clear();
    clearFeedbackBeachOption();
    clearFeedbackLocationOption();
    let currentCity = this.value;
    let beachList = allBeachData.filter(function (beach) {
        return beach.city.includes(currentCity);
    })

    let beachNamesArray = [];
    beachList.forEach(function (beach) {
        if (beachNamesArray.includes(beach.beachName) === false) {
            beachNamesArray.push(beach.beachName);
            createBeachFilterOption(beach.beachName);
        }
    })
};

const feedbackBeachFilter = document.querySelector('#feedbackBeach');
feedbackBeachFilter.addEventListener('change', addLocationOption)



function createBeachFilterOption(beachName) {

    let newOption = document.createElement('option');
    newOption.setAttribute('value', beachName);
    newOption.textContent = beachName;
    feedbackBeachFilter.appendChild(newOption);
}

function clearFeedbackBeachOption() {
    while (feedbackBeachFilter.childNodes[0]) {
        feedbackBeachFilter.removeChild(feedbackBeachFilter.childNodes[0]);
    }
    feedbackBeachFilter.innerHTML = `<option selected disabled hidden>選擇海灘名稱</option>`;
}

function addLocationOption(event) {
    clearFeedbackLocationOption();
    let currentBeach = this.value;
    let locationList = allBeachData.filter(function (beach) {
        return beach.beachName.includes(currentBeach);
    })
    // console.table(locationList);
    let locationNamesArray = [];
    locationList.forEach(function (location) {
        if (locationNamesArray.includes(location.title) === false) {
            locationNamesArray.push(location.title);
            createFeedbackLocationOption(location.title);
        }
    })
}

const feedbackLocationFilter = document.querySelector('#feedbackLocation');

function createFeedbackLocationOption(locationName) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', locationName);
    newOption.textContent = locationName;
    feedbackLocationFilter.appendChild(newOption);
}

function clearFeedbackLocationOption() {
    while (feedbackLocationFilter.childNodes[0]) {
        feedbackLocationFilter.removeChild(feedbackLocationFilter.childNodes[0]);
    }
    feedbackLocationFilter.innerHTML = `<option selected disabled hidden>選擇海灘分段</option>`;
}

feedbackLocationFilter.addEventListener('change', selectFeedbackLocation);

function selectFeedbackLocation(event) {
    console.clear();
    
    let currentLocation = this.value;
    let currentLocationData = allBeachData.filter(function (position) {
        return position.title.includes(currentLocation);
    })
    // console.log(currentLocationData);
    feedbackData = currentLocationData[0];
    drawSelectPosition(currentLocationData[0]);
}

function drawSelectPosition(dataObj) {
    removeReportSealine();
    if (reportMarker !== undefined){
        reportMarker.setMap(null);
    }
    console.log(dataObj);
    let coord = dataObj.geojson.reduce(function (accumulator, currentValue) {
        // console.log(accumulator, currentValue)
        return [(accumulator[0]) + (currentValue[0]) / dataObj.geojson.length, (accumulator[1]) + (currentValue[1]) / dataObj.geojson.length];
    }, [0, 0]);

    reportMarker = new google.maps.Marker({
        position: { lat: coord[1], lng: coord[0] },
        animation: google.maps.Animation.DROP,
        map: reportMap,
        draggable: true,
        // icon: markerIcon,
        // cityname: beach.cityname,
        // sealinename: beach.sealinename,
        // date: beach.date,
        // clean: beach.clean
    });

    currentFeedbackPosition = { lat: coord[1], lng: coord[0] };
    console.log(currentFeedbackPosition)

    reportMap.setCenter({lat: coord[1], lng: coord[0]});
    reportMap.setZoom(16);

    let googleArray = [];
    dataObj.geojson.forEach(function (coord) {
        let coordObj = { lat: coord[1], lng: coord[0] };
        googleArray.push(coordObj);
    });
    dataFeature = { geometry: new google.maps.Data.MultiLineString([googleArray]) };

    reportMap.data.add(dataFeature);
    reportMap.data.setStyle({
        strokeWeight: 10,
        strokeColor: 'blue',
    });

    feedbackInfoWindow = new google.maps.InfoWindow({
        content: '<p class = "feebackText">' + '回報位置' + '</p>'
    });

    feedbackInfoWindow.open(reportMap, reportMarker);
    google.maps.event.addListener(reportMarker, 'drag', showFeedbackWindow);
}

//取得marker 移動座標
function showFeedbackWindow() {
    let currentMarker = this;
    // let currentPositionText = currentMarker.getPosition().toString();
    // console.log(currentMarker.getPosition().toJSON());
    // feedbackInfoWindow.setContent ('<p>Marker Location:' + currentPositionText + '</p>');
    currentFeedbackPosition = currentMarker.getPosition().toJSON();
    console.log(currentFeedbackPosition);
    feedbackInfoWindow.open(reportMap, reportMarker);
    
    // marker.setPosition(currentPosition);
    
}

function removeReportSealine() {
    //remove pattern
    reportMap.data.forEach(function (feature) {
        // console.log(feature);
        reportMap.data.remove(feature);
    });
}



let allBeachData;

$.ajax({
    url: 'https://hainan-api.oss.tw/api/beach/',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        allBeachData = response.result;
        console.log(allBeachData)
    },
    error: function (jqXHR, status, errorThrown) {
        console.log(jqXHR);
    }
})

