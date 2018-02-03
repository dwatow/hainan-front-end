let reportMarker;
let reportMap;
let feedbackInfoWindow;
let beachList;
let peopleInfoWindow;

let allBeachData;
let feedbackData;

let taiwanCityData = [
    { cityName:"新北市" , position:{lat:24.91571 , lng:121.6739}},
    { cityName:"基隆市" , position:{lat:25.10898 , lng:121.7081}},
    { cityName:"桃園市" , position:{lat:24.93759 , lng:121.2168}},
    { cityName:"新竹縣" , position:{lat:24.70328 , lng:121.1252}},
    { cityName:"新竹市" , position:{lat:24.80395 , lng:120.9647}},
    { cityName:"苗栗縣" , position:{lat:24.48927 , lng:120.9417}},
    { cityName:"臺中市" , position:{lat:24.23321 , lng:120.9417}},
    { cityName:"彰化縣" , position:{lat:23.99297 , lng:120.4818}},
    { cityName:"雲林縣" , position:{lat:23.7558 , lng:120.3897}},
    { cityName:"嘉義縣" , position:{lat:23.45889 , lng:120.574}},
    { cityName:"臺南市" , position:{lat:23.1417 , lng:120.2513}},
    { cityName:"高雄市" , position:{lat:23.01087 , lng:120.666}},
    { cityName:"屏東縣" , position:{lat:22.54951 , lng:120.62}},
    { cityName:"宜蘭縣" , position:{lat:24.69295 , lng:121.7195}},
    { cityName:"花蓮縣" , position:{lat:23.7569 , lng:121.3542}},
    { cityName:"臺東縣" , position:{lat:22.98461 , lng:120.9876}},
    { cityName:"澎湖縣" , position:{lat:23.56548 , lng:119.6151}},
    { cityName:"金門縣" , position:{lat:24.43679 , lng:118.3186}},
    { cityName:"連江縣" , position:{lat:26.19737 , lng:119.5397}},
]

const feedbackPage = document.querySelector('.feedbackPage');
feedbackPage.addEventListener('click', loadFeedbackMap);
function loadFeedbackMap() {
    window.addEventListener('hashchange', initReportMap, { once: true });
}

// window.addEventListener('hashchange', initReportMap);
let currentFeedbackPosition;

function initReportMap() {
    console.log(currentFeedbackPosition);
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
    };

    if (navigator.geolocation) {
        peopleInfoWindow = new google.maps.InfoWindow({ map: reportMap });
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            peopleInfoWindow.setPosition(pos);
            peopleInfoWindow.setContent('你在這裡');
            reportMap.setCenter(pos);
            reportMap.setZoom(12);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
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

let cityBeachMarkers = [];

function addBeachOption(event) {
    clearCityBeachMarkers()
    console.clear();
    clearFeedbackBeachOption();
    clearFeedbackLocationOption();
    clearLocationMarkers();
    removeReportSealine();

    if (feedbackInfoWindow !== undefined) {
        feedbackInfoWindow.close();
    }
    if (selectMarker !== undefined){
        selectMarker.setMap(null);
    }
    let currentCity = this.value;
    // console.log(currentCity)

    let cityData = taiwanCityData.filter(function(city){
        return city.cityName.includes(currentCity)
    })



    let cityCoord = cityData[0].position;
    // reportMap.setCenter(cityCoord);
    // reportMap.setZoom(8);

    beachList = allBeachData.filter(function (beach) {
        return beach.city.includes(currentCity);
    })

    let allcityBeach = {};
    let allcityBeachArray = [];
    beachList.forEach(function(cityBeach){
        let beachName = cityBeach.beachName;
        // console.log(allcityBeach[`${beachName}`])
        if (allcityBeach[`${beachName}`] === undefined) {
            allcityBeach[`${beachName}`] = cityBeach.geojson;
            allcityBeachArray.push({
                name:beachName, 
                coord:cityBeach.geojson
            })
        }
        
    });

    console.log(allcityBeachArray)


    // console.log(maxLat(allcityBeachArray))
    allcityBeachArray.forEach(function(cityBeach, index){
        let tempCoord = cityBeach.coord[0];
        console.log(tempCoord)
        cityBeachMarkers[index] = new google.maps.Marker({
            position: {lat: tempCoord[1], lng:tempCoord[0]},
            value:cityBeach.name,
        })
        cityBeachMarkers[index].setMap(reportMap);
        google.maps.event.addListener(cityBeachMarkers[index], 'click', selectMapBeach);
    })

    let beachNamesArray = [];
    beachList.forEach(function (beach) {
        if (beachNamesArray.includes(beach.beachName) === false) {
            beachNamesArray.push(beach.beachName);
            createBeachFilterOption(beach.beachName);
        }
    })
    
};

function selectMapBeach (event) {
    let selectedMapBeachMarker = this;
    let selectedMapBeachOption = document.querySelector(`option[value = ${this.value}]`);
    // selectedMapBeachOption.selected=true;
    document.querySelector('#feedbackBeach').value = this.value;
    // $("#feedbackBeach").change();
    // document.querySelector('#feedbackBeach').change();
    
    locationList = beachList.filter(function (beach) {
        // console.log(beach)
        return beach.beachName.includes(selectedMapBeachMarker.value);
    })
    console.log(beachList);
    
    addLocationOption(event, selectedMapBeachMarker.value);
}


function clearCityBeachMarkers() {
    for (var i = 0; i < cityBeachMarkers.length; i++) {
        if (cityBeachMarkers[i]) {
            cityBeachMarkers[i].setMap(null);
        }
    }
    cityBeachMarkers = [];
}



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

let locationList = [];
let locationMarkers = [];
let colorSwitch = true;

function addLocationOption(event, beachName) {
    clearCityBeachMarkers();
    clearFeedbackLocationOption();
    clearLocationMarkers();
    removeReportSealine();

    if (feedbackInfoWindow !== undefined) {
        feedbackInfoWindow.close();
    }
    if (selectMarker !== undefined){
        selectMarker.setMap(null);
    }
    let currentBeach; 
    if (event.target === undefined){
        currentBeach = beachName;
    } else {
        currentBeach = event.target.value;
        document.querySelector('#feedbackBeach').value = this.value;
    }
    console.log(currentBeach)
    locationList = beachList.filter(function (beach) {
        return beach.beachName.includes(currentBeach);
    })
    console.table(beachList)
    console.table(locationList);
    let locationNamesArray = [];


    locationList.forEach(function (location) {
        if (locationNamesArray.includes(location.title) === false) {
            locationNamesArray.push(location.title);
            createFeedbackLocationOption(location.title);
        }
    })

    locationList.forEach(function(location, index){
        // console.log(location.contact)
            let locationCoord = location.geojson.reduce(function (accumulator, currentValue) {
                // console.log(accumulator, currentValue)
                return [(accumulator[0]) + (currentValue[0]) / location.geojson.length, (accumulator[1]) + (currentValue[1]) / location.geojson.length];
            }, [0, 0]);

            locationMarkers[index] = new google.maps.Marker({
                position: { lat: locationCoord[1], lng: locationCoord[0] },
                animation: google.maps.Animation.DROP,
                // icon: markerIcon,
                // activity: beach.title,
                // city: beach.city,
                sealinename: location.title,
                // date: cleanDateArray[0],
                // contact:JSON.parse(location.geojson),
            });
            google.maps.event.addListener(locationMarkers[index], 'click', showLocationWindow);
            // console.log(beach.contact)
    
            let locationArray = [];
            location.geojson.forEach(function (coord) {
                let coordObj = { lat: coord[1], lng: coord[0] };
                locationArray.push(coordObj);
            });
    
            dataFeature = { geometry: new google.maps.Data.MultiLineString([locationArray]) };
            reportMap.data.add(dataFeature);
            reportMap.data.setStyle(function(f) {
                if(colorSwitch) {
                  fStrokeColor = 'blue';
                  colorSwitch = false;
                } else {
                  fStrokeColor = 'yellow';
                  colorSwitch = true;
                }
                return {
                    strokeWeight: 10,
                    strokeColor: fStrokeColor,
                }
              });
    
           
            // cityBeachMarkers[index] = new google.maps.Marker({
            //     position: {lat: tempCoord[1], lng:tempCoord[0]},
            //     value:cityBeach.name,
            // })
            locationMarkers[index].setMap(reportMap);
            // google.maps.event.addListener(cityBeachMarkers[index], 'click', selectMapBeach);
    })
}

function showLocationWindow() {
    var reportMarker = this;
    reportMap.setZoom(13);
    reportMap.setCenter(reportMarker.getPosition());
    if (feedbackInfoWindow !== undefined) {
        feedbackInfoWindow.close();
    }
    feedbackInfoWindow = new google.maps.InfoWindow({
        content: '<p class = "feebackText">' + '回報位置' + '</p>'
    });
    feedbackInfoWindow.open(reportMap, reportMarker);
    document.querySelector('#feedbackLocation').value = reportMarker.sealinename;
    let feedbackDataFilter = beachList.filter(function (position) {
        return position.title.includes(reportMarker.sealinename);
    })
    feedbackData = feedbackDataFilter[0];
    console.log(feedbackData)
}


function clearLocationMarkers() {
    for (var i = 0; i < locationMarkers.length; i++) {
        if (locationMarkers[i]) {
            locationMarkers[i].setMap(null);
        }
    }
    locationMarkers = [];
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
    let currentLocationData = beachList.filter(function (position) {
        return position.title.includes(currentLocation);
    })
    // console.log(currentLocationData);
    feedbackData = currentLocationData[0];
    drawSelectPosition(currentLocationData[0]);
}

let selectMarker;

function drawSelectPosition(dataObj) {
    // removeReportSealine();
    if (selectMarker !== undefined){
        selectMarker.setMap(null);
    }
    console.log(dataObj);
    let coord = dataObj.geojson.reduce(function (accumulator, currentValue) {
        // console.log(accumulator, currentValue)
        return [(accumulator[0]) + (currentValue[0]) / dataObj.geojson.length, (accumulator[1]) + (currentValue[1]) / dataObj.geojson.length];
    }, [0, 0]);

    selectMarker = new google.maps.Marker({
        position: { lat: coord[1], lng: coord[0] },
        map: reportMap,
        // draggable: true,
        // icon: markerIcon,
        // cityname: beach.cityname,
        // sealinename: beach.sealinename,
        // date: beach.date,
        // clean: beach.clean
    });

    currentFeedbackPosition = { lat: coord[1], lng: coord[0] };
    console.log(currentFeedbackPosition)

    reportMap.setCenter({lat: coord[1], lng: coord[0]});
    reportMap.setZoom(13);

    // let googleArray = [];
    // dataObj.geojson.forEach(function (coord) {
    //     let coordObj = { lat: coord[1], lng: coord[0] };
    //     googleArray.push(coordObj);
    // });
    // dataFeature = { geometry: new google.maps.Data.MultiLineString([googleArray]) };

    // reportMap.data.add(dataFeature);
    // reportMap.data.setStyle({
    //     strokeWeight: 10,
    //     strokeColor: 'blue',
    // });
    if (feedbackInfoWindow !== undefined) {
        feedbackInfoWindow.close();
    }

    feedbackInfoWindow = new google.maps.InfoWindow({
        content: '<p class = "feebackText">' + '回報位置' + '</p>'
    });

    feedbackInfoWindow.open(reportMap, selectMarker);
    // google.maps.event.addListener(reportMarker, 'drag', showFeedbackWindow);
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

