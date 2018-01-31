//fake data
let activityData = [
    {
        "cityname": "臺南市", "sealinename": "黃金海岸", "coordinates": [
            [
                120.17607431485473,
                22.930725534782255
            ],
            [
                120.1761817932129,
                22.92930645370021
            ]
        ], "activity": "黃金海岸淨灘", "date": "2018/03/01"
    },
    {
        "cityname": "嘉義縣", "sealinename": "東石橋畔出海口", "coordinates": [
            [
                120.17892956729158,
                23.4647674172182
            ],
            [
                120.17695546145661,
                23.46342895064905
            ],
            [
                120.17670470547195,
                23.46118648719332
            ]
        ], "activity": "東石橋畔出海口淨灘", "date": "2018/03/02"
    },
    {
        "cityname": "臺東縣", "sealinename": "豐里二號橋", "coordinates": [
            [
                121.10264062872375,
                22.706256209590048
            ],
            [
                121.10674144762326,
                22.708688485720593
            ]
        ], "activity": "豐里二號橋淨灘", "date": "2018/03/03"
    },
    {
        "cityname": "花蓮縣", "sealinename": "奇萊鼻至東防波", "coordinates": [
            [
                121.64324820041658,
                24.018650111280472
            ],
            [
                121.64339840412141,
                24.01830221583367
            ],
            [
                121.64389729499818,
                24.017165424148576
            ],
            [
                121.6445678472519,
                24.015847321207293
            ],
            [
                121.64506673812868,
                24.014578205608412
            ],
            [
                121.6451183674332,
                24.014478783106245
            ]
        ], "activity": "奇萊鼻至東防波淨灘", "date": "2018/03/04"
    },
    {
        "cityname": "新北市", "sealinename": "龍洞地質公園停車場至龍安廟前海岸", "coordinates": [
            [
                121.91305137141984,
                25.1141317045611
            ],
            [
                121.91292285919191,
                25.114015418454322
            ]
        ], "activity": "龍洞地質公園淨灘", "date": "2018/03/05"
    }
];

let reportData = [
    {
        "cityname": "臺南市", "sealinename": "黃金海岸", "coordinates": [
            [
                120.17607431485473,
                22.930725534782255
            ],
            [
                120.1761817932129,
                22.92930645370021
            ]
        ], "clean": "是", "date": "2017/09/01"
    },
    {
        "cityname": "嘉義縣", "sealinename": "東石橋畔出海口", "coordinates": [
            [
                120.17892956729158,
                23.4647674172182
            ],
            [
                120.17695546145661,
                23.46342895064905
            ],
            [
                120.17670470547195,
                23.46118648719332
            ]
        ], "clean": "否", "date": "2017/08/02"
    },
    {
        "cityname": "臺東縣", "sealinename": "豐里二號橋", "coordinates": [
            [
                121.10264062872375,
                22.706256209590048
            ],
            [
                121.10674144762326,
                22.708688485720593
            ]
        ], "clean": "是", "date": "2017/02/03"
    },
    {
        "cityname": "花蓮縣", "sealinename": "奇萊鼻至東防波", "coordinates": [
            [
                121.64324820041658,
                24.018650111280472
            ],
            [
                121.64339840412141,
                24.01830221583367
            ],
            [
                121.64389729499818,
                24.017165424148576
            ],
            [
                121.6445678472519,
                24.015847321207293
            ],
            [
                121.64506673812868,
                24.014578205608412
            ],
            [
                121.6451183674332,
                24.014478783106245
            ]
        ], "clean": "否", "date": "2017/05/04"
    }
];

const displayFilter = document.querySelector('#displayFilter');
displayFilter.addEventListener('change', display);

function display(event) {
    map.setZoom(7);
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
    console.log('initMap Success')
    //HomePage Map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 23.5, lng: 121 },
        fullscreenControl: false,
        streetViewControl: false,
    });
    activityInfoWindow = new google.maps.InfoWindow({
        content: document.getElementById('activity-info-content')
    });
    reportInfoWindow = new google.maps.InfoWindow({
        content: document.getElementById('report-info-content')
    });
    dropActivityMarker();
};

let markers = [];
function dropActivityMarker() {
    removeAllSealine();
    clearResults();
    clearMarkers();
    activityData.forEach(function(beach, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        let markerIcon = `./css/GoogleMarkers/green_Marker${markerLetter}.png`;
        let coord = beach.coordinates.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / beach.coordinates.length, (accumulator[1]) + (currentValue[1]) / beach.coordinates.length];
        }, [0, 0]);

        markers[index] = new google.maps.Marker({
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            activity: beach.activity,
            cityname: beach.cityname,
            sealinename: beach.sealinename,
            date: beach.date
        });

        let googleArray = [];
        beach.coordinates.forEach(function (coord) {
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
        setTimeout(dropMarker(index), index * 300);
        addResult(beach, index, markerIcon);
    });
};

function dropReportMarker() {
    removeAllSealine();
    clearResults();
    clearMarkers();
    reportData.forEach(function(beach, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        let markerIcon = `./css/GoogleMarkers/red_Marker${markerLetter}.png`;
        let coord = beach.coordinates.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / beach.coordinates.length, (accumulator[1]) + (currentValue[1]) / beach.coordinates.length];
        }, [0, 0]);

        markers[index] = new google.maps.Marker({
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            cityname: beach.cityname,
            sealinename: beach.sealinename,
            date: beach.date,
            clean: beach.clean
        });

        let googleArray = [];
        beach.coordinates.forEach(function (coord) {
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
        setTimeout(dropMarker(index), index * 300);
        addResult(beach, index, markerIcon);
    })
};

function removeAllSealine() {
    //remove pattern
    map.data.forEach(function (feature) {
        console.log(feature);
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
    if (result.clean === undefined) {
        nameTd.innerHTML = `活動日期${result.date}-${result.activity}`;
    } else {
        nameTd.innerHTML = `回報日期${result.date}-${result.sealinename}`;
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
    activityInfoWindow.open(map, marker);
    document.getElementById('activity').innerHTML = `${marker.activity}`;
    document.getElementById('iw-beach').textContent = marker.sealinename;
    // document.getElementById('iw-city').textContent = marker.cityname;
    document.getElementById('iw-date').textContent = marker.date;
    // document.getElementById('iw-location').textContent = 'location';
    document.getElementById('iw-host').textContent = '歐巴馬';
    document.getElementById('iw-phone').textContent = '09xxxxxxxx';
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
    document.getElementById('iw-clean').textContent = marker.clean;
    reportImage.style.backgroundImage = `url(https://i.imgur.com/FtsBIRx.jpg)`;
    showActive({
        beach: "某個海灘",
        city: "城市",
        date: "活動日期",
        location: "集合地點",
        host: "聯絡人",
        phone: "聯絡電話"
    });
};
