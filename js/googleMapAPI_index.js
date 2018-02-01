//fake data
let activityData = [];

let reportData = [];
//get created Report
$.ajax({
    url: 'https://hainan-api.oss.tw/api/beach/activity',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        activityData = response.result;
        console.log(activityData)
        initIndexMap();
    },
    error: function (jqXHR, status, errorThrown) {
        console.log(jqXHR);
    }
})

//get created Feedback
$.ajax({
    url: 'https://hainan-api.oss.tw/api/beach/notification',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
        reportData = response.result;
        // console.log(reportData);
    },
    error: function (jqXHR, status, errorThrown) {
        console.log(jqXHR);
    }
})

const displayFilter = document.querySelector('#displayFilter');
displayFilter.addEventListener('change', display);

function display(event) {
    map.setZoom(6);
    map.setCenter({ lat: 23.5, lng: 121 });
    clearResults();
    clearMarkers();
    if (this.value === "activities") {
        dropActivityMarker();
    } else {
        dropReportMarker()
    }
};

const indexPage = document.querySelector('.indexPage');
indexPage.addEventListener('click', loadIndexMap);

// window.addEventListener('hashchange', initIndexMap);
function loadIndexMap() {
    displayFilter.value = "activities";
    window.addEventListener('hashchange', initIndexMap, { once: true });
}


let map;
let activityInfoWindow;
let reportInfoWindow;
function initIndexMap() {
    // console.log('initMap Success')
    //HomePage Map
    if (map === undefined) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: { lat: 23.5, lng: 121 },
            fullscreenControl: false,
            streetViewControl: false,
        });
    } else {
        map.setCenter({ lat: 23.5, lng: 121 });
        map.setZoom(6);
    };

    if (activityInfoWindow === undefined) {
        activityInfoWindow = new google.maps.InfoWindow({
            content: document.getElementById('activity-info-content')
        });
    }
   
    if (reportInfoWindow === undefined) {
        reportInfoWindow = new google.maps.InfoWindow({
            content: document.getElementById('report-info-content')
        });
    }
    dropActivityMarker();
};

let markers = [];
function dropActivityMarker() {
    removeAllSealine();
    clearResults();
    clearMarkers();
    // console.log("dropActivityMarker")

    let organizedActivityData = activityData.sort(function(a, b){
        if (a.dateTime > b.dateTime) {
            return 1;
        }
    })
    // console.table(organizedactivityData)
    
    organizedActivityData.forEach(function(beach, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        let markerIcon = `./css/GoogleMarkers/green_Marker${markerLetter}.png`;
        let coord = beach.geojson.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / beach.geojson.length, (accumulator[1]) + (currentValue[1]) / beach.geojson.length];
        }, [0, 0]);

        let cleanDateArray = beach.dateTime.split('T');

        markers[index] = new google.maps.Marker({
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            activity: beach.title,
            city: beach.city,
            sealinename: beach.beachTitle,
            date: cleanDateArray[0],
            contact:beach.contact,
        });

        let googleArray = [];
        beach.geojson.forEach(function (coord) {
            let coordObj = { lat: coord[1], lng: coord[0] };
            googleArray.push(coordObj);
        });

        dataFeature = { geometry: new google.maps.Data.MultiLineString([googleArray]) };
        map.data.add(dataFeature);
        map.data.setStyle({
            strokeWeight: 12,
            strokeColor: 'GREEN',
        });

        google.maps.event.addListener(markers[index], 'click', showActivityWindow);
        setTimeout(dropMarker(index), index * 50);
        addResult(beach, index, markerIcon);
    });
};

function dropReportMarker() {
    removeAllSealine();
    clearResults();
    clearMarkers();

    let organizedReportData = reportData.sort(function(a, b){
        if (a.updateDate > b.updateDate) {
            return 1;
        }
    })

    organizedReportData.forEach(function(beach, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        let markerIcon = `./css/GoogleMarkers/red_Marker${markerLetter}.png`;
        let coord = beach.geojson.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / beach.geojson.length, (accumulator[1]) + (currentValue[1]) / beach.geojson.length];
        }, [0, 0]);

        let feedbackDateArray = beach.updateDate.split('T');

        markers[index] = new google.maps.Marker({
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            cityname: beach.city,
            sealinename: beach.beachName,
            date: feedbackDateArray[0],
            clean: beach.beachClean,
            url:beach.imageURL
        });

        let googleArray = [];
        beach.geojson.forEach(function (coord) {
            let coordObj = { lat: coord[1], lng: coord[0] };
            googleArray.push(coordObj);
        });
        dataFeature = { geometry: new google.maps.Data.MultiLineString([googleArray]) };

        map.data.add(dataFeature);
        map.data.setStyle({
            strokeWeight: 12,
            strokeColor: 'Red',
        });

        google.maps.event.addListener(markers[index], 'click', showReportWindow);
        setTimeout(dropMarker(index), index * 50);
        addResult(beach, index, markerIcon);
    })
};

function removeAllSealine() {
    //remove pattern
    map.data.forEach(function (feature) {
        // console.log(feature);
        map.data.remove(feature);
    });
}

function dropMarker(i) {
    return function () {
        markers[i].setMap(map);
    };
};

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i]) {
            markers[i].setMap(null);
        }
    }
    markers = [];
}
function clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
        results.removeChild(results.childNodes[0]);
    }
}

const results = document.getElementById('results');
let reportImage = document.querySelector('.reportImage');

function addResult(result, i, markerIcon) {
    // console.log(result)
    // let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    // let markerIcon = iconImage + markerLetter + '.png';
    let tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function () {
        google.maps.event.trigger(markers[i], 'click');
    };
    let iconTd = document.createElement('td');
    let nameTd = document.createElement('td');
    let icon = document.createElement('img');
    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    icon.setAttribute('className', 'placeIcon');
    iconTd.appendChild(icon);
    if (result.dateTime === undefined) {
        let feedbackDateArray = result.updateDate.split('T');
        nameTd.innerHTML = `回報日期${feedbackDateArray[0]}-${result.title}`;
        
    } else {
        let cleanDateArray = result.dateTime.split('T');
        nameTd.innerHTML = `活動日期${cleanDateArray[0]}-${result.title}`;
    }
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
};

function showActivityWindow(event) {
    let marker = this;
    map.setZoom(12);
    map.setCenter(marker.getPosition());
    //開啟infoWindow
    let contactWindow = JSON.parse(marker.contact);
    console.log(contactWindow)
    activityInfoWindow.open(map, marker);
    document.getElementById('activity').innerHTML = `${marker.activity}`;
    document.getElementById('iw-beach').textContent = marker. sealinename;
    // document.getElementById('iw-city').textContent = marker.cityname;
    document.getElementById('iw-date').textContent = marker.date;
    // document.getElementById('iw-location').textContent = 'location';
    document.getElementById('iw-host').textContent = contactWindow.name;
    document.getElementById('iw-phone').textContent = contactWindow.phone;
    showActive({
        beach: "某個海灘",
        city: "城市",
        date: "活動日期",
        location: "集合地點",
        host: "聯絡人",
        phone: "聯絡電話"
    });
};

function showReportWindow(event) {
    var marker = this;
    map.setZoom(12);
    map.setCenter(marker.getPosition());
    //開啟infoWindow
    reportInfoWindow.open(map, marker);
    document.getElementById('report').innerHTML = `${marker.sealinename}`;
    document.getElementById('iw-reportDate').textContent = marker.date;
    if (marker.clean) {
        document.getElementById('iw-clean').textContent = "否";
    } else {
        document.getElementById('iw-clean').textContent = "是";
    }
    
    reportImage.style.backgroundImage = `url(${marker.url})`;
    showActive({
        beach: "某個海灘",
        city: "城市",
        date: "活動日期",
        location: "集合地點",
        host: "聯絡人",
        phone: "聯絡電話"
    });
};
