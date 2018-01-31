
let reportMarker;
let reportMap;
let feedbackInfoWindow;

let currentPosition;
let feedbackData;

const feedbackPage = document.querySelector('.feedbackPage');
feedbackPage.addEventListener('click', loadFeedbackMap);
function loadFeedbackMap() {
    window.addEventListener('hashchange', initReportMap, { once: true });
}

// window.addEventListener('hashchange', initReportMap);

function initReportMap() {
    // console.log(currentPosition);
    if (currentPosition === undefined) {
        reportMap = new google.maps.Map(document.getElementById('reportMap'), {
            center: { lat: 24.3, lng: 120.51 },
            zoom: 6,
            center: { lat: 23.5, lng: 121 },
            fullscreenControl: false,
            streetViewControl: false,
        });
    } else {
        reportMap.setCenter(currentPosition);
        reportMap.setZoom(16) 
    }
}

function showFeedbackWindow() {
    let currentMarker = this;
    let currentPositionText = currentMarker.getPosition().toString();
    currentPosition = currentMarker.getPosition().toJSON();
    reportCurrentPosition = currentPosition;
    console.log(currentPosition);
    infoWindow.open(map, marker);
}

const cityFilter = document.querySelector('#feedbackCity');
cityFilter.addEventListener('change', addBeachOption);

function addBeachOption(event) {
    console.clear();
    clearBeachOption();
    clearLocationOption();
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

const beachFilter = document.querySelector('#feedbackBeach');
beachFilter.addEventListener('change', addLocationOption)

function clearBeachOption() {
    while (beachFilter.childNodes[0]) {
        beachFilter.removeChild(beachFilter.childNodes[0]);
    }
    beachFilter.innerHTML = `<option selected disabled hidden>選擇海灘分段</option>`;
}

function createBeachFilterOption(beachName) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', beachName);
    newOption.textContent = beachName;
    beachFilter.appendChild(newOption);
}

function addLocationOption(event) {
    clearLocationOption()
    let currentBeach = this.value;
    let locationList = allBeachData.filter(function (beach) {
        return beach.beachName.includes(currentBeach);
    })
    // console.table(locationList);
    let locationNamesArray = [];
    locationList.forEach(function (location) {
        if (locationNamesArray.includes(location.title) === false) {
            locationNamesArray.push(location.title);
            createLocationFilterOption(location.title);
        }
    })
}

const locationFilter = document.querySelector('#feedbackLocation');
locationFilter.addEventListener('change', selectLocation);

function createLocationFilterOption(locationName) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', locationName);
    newOption.textContent = locationName;
    locationFilter.appendChild(newOption);
}

function clearLocationOption() {
    while (locationFilter.childNodes[0]) {
        locationFilter.removeChild(locationFilter.childNodes[0]);
    }
    locationFilter.innerHTML = `<option selected disabled hidden>選擇海灘分段</option>`;
}

function selectLocation(event) {
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

    currentPosition = { lat: coord[1], lng: coord[0] };
    console.log(currentPosition)

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
    currentPosition = currentMarker.getPosition().toJSON();
    console.log(currentPosition);
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

