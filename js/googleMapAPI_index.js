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
        // console.log(activityData)
        initIndexMap();
    },
    error: function (jqXHR, status, errorThrown) {
        // console.log(jqXHR);
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
        // console.log(jqXHR);
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
    console.log("loadMap")
    // displayFilter.value = "activities";
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

    let organizedActivityData = activityData.sort(function(a, b) {

        const aArray = a.dateTime.split('-')
        const aTime = new Date(aArray.shift(), aArray.shift(), aArray.shift().split('T').shift());

        const bArray = b.dateTime.split('-')
        const bTime = new Date(bArray.shift(), bArray.shift(), bArray.shift().split('T').shift());

        return bTime - aTime;
    }).slice(0, 50);
    // console.table(organizedactivityData)

    organizedActivityData.forEach(function(activity, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        let markerIcon = `./css/GoogleMarkers/green_Marker${markerLetter}.png`;
        let coord = activity.geojson.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / activity.geojson.length, (accumulator[1]) + (currentValue[1]) / activity.geojson.length];
        }, [0, 0]);

        let cleanDateArray = activity.dateTime.split('T');
        // console.log(activity);

        markers[index] = new google.maps.Marker({
            id: activity.id,
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            activityTitle: activity.title,
            city: activity.city,
            beachame: activity.beachName,
            beachTitle: activity.beachTitle,
            date: cleanDateArray[0],
            collectionPlace: activity.place,
            contact:JSON.parse(activity.contact),
        });


        // beachName: "洲子灣海岸"
        // beachTitle: "洲子灣海岸-2"

        // console.log(activity.contact)

        let googleArray = [];
        activity.geojson.forEach(function (coord) {
            let coordObj = { lat: coord[1], lng: coord[0] };
            googleArray.push(coordObj);
        });

        dataFeature = { geometry: new google.maps.Data.MultiLineString([googleArray]) };
        map.data.add(dataFeature);
        map.data.setStyle({
            strokeWeight: 12,
            strokeColor: 'green',
        });

        google.maps.event.addListener(markers[index], 'click', showActivityWindow);
        setTimeout(dropMarker(index), index * 5);
        addResult(activity, index, markerIcon);
    });
};

let feedbackSwitch = true;

function dropReportMarker() {
    // console.log('test')
    removeAllSealine();
    clearResults();
    clearMarkers();

    let organizedReportData = reportData.sort(function(a, b){

        const aArray = a.updateDate.split('-')
        const aTime = new Date(aArray.shift(), aArray.shift(), aArray.shift().split('T').shift());

        const bArray = b.updateDate.split('-')
        const bTime = new Date(bArray.shift(), bArray.shift(), bArray.shift().split('T').shift());

        return bTime - aTime;
    }).slice(0, 50);

    organizedReportData.forEach(function(beach, index){
        let markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));

        if (beach.beachClean === true) {
            var markerIcon = `./css/GoogleMarkers/blue_Marker${markerLetter}.png`;
            feedbackSwitch = true;
        } else {
            var markerIcon = `./css/GoogleMarkers/red_Marker${markerLetter}.png`;
            feedbackSwitch = false;
        }

        // console.log(markerIcon)

        let coord = beach.geojson.reduce(function (accumulator, currentValue) {
            // console.log(accumulator, currentValue)
            return [(accumulator[0]) + (currentValue[0]) / beach.geojson.length, (accumulator[1]) + (currentValue[1]) / beach.geojson.length];
        }, [0, 0]);

        let feedbackDateArray = beach.updateDate.split('T');
        // console.log(beach);
        markers[index] = new google.maps.Marker({
            id: beach.id,
            position: { lat: coord[1], lng: coord[0] },
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
            city: beach.city,
            beachName: beach.beachName,
            beachTitle: beach.title,
            date: feedbackDateArray[0],
            isClean: beach.beachClean,
            url: beach.imageURL
        });

        let googleArray = [];
        beach.geojson.forEach(function (coord) {
            let coordObj = { lat: coord[1], lng: coord[0] };
            googleArray.push(coordObj);
        });
        dataFeature = {
            geometry: new google.maps.Data.MultiLineString([googleArray]),
         };

        //  if (beach.beachClean === true) {
        //      dataFeature.setProperty({clean:'yes'});
        //  }


        map.data.add(dataFeature);
        // map.data.overrideStyle(dataFeature, {
        //     strokeColor:'red',
        //     opacity:0.5
        //  });
        map.data.setStyle(function(dataFeature) {
            // var color;
            // if(feedbackSwitch) {
            //   color = '#e4a13d';
            //   console.log(color);
            //   feedbackSwitch = false;
            // } else {
            //   color = 'blue';
            //   console.log(color);
            //   feedbackSwitch = true;
            // }
            return {
                strokeWeight: 12,
                strokeColor: '#e4a13d',
            }
        });

        google.maps.event.addListener(markers[index], 'click', showReportWindow);
        setTimeout(dropMarker(index), index * 5);
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
    let contactWindow = marker.contact;
    // let contactWindow = JSON.parse(marker.contact);
    // console.log(contactWindow)
    activityInfoWindow.open(map, marker);
    document.getElementById('activity').innerHTML = `${marker.activityTitle}`;
    document.getElementById('iw-beach').textContent = marker. beachTitle;
    // document.getElementById('iw-city').textContent = marker.cityname;
    document.getElementById('iw-date').textContent = marker.date;
    // document.getElementById('iw-location').textContent = 'location';
    document.getElementById('iw-host').textContent = contactWindow.name;
    document.getElementById('iw-phone').textContent = contactWindow.phone;
    console.log(marker);
    showActive ({
        "活動名稱": marker.activityTitle,
        "城市": marker.city,
        "活動日期": marker.date,
        "集合地點": marker.collectionPlace,
        "聯絡人": marker.contact.name,
        "聯絡電話": marker.contact.phone,
        modifyActivityButton: marker.id
    });
};

function showReportWindow(event) {
    var marker = this;
    map.setZoom(12);
    map.setCenter(marker.getPosition());
    //開啟infoWindow
    reportInfoWindow.open(map, marker);
    document.getElementById('report').innerHTML = `${marker.beachTitle}`;
    document.getElementById('iw-reportDate').textContent = marker.date;
    if (marker.clean) {
        document.getElementById('iw-clean').textContent = "否";
    } else {
        document.getElementById('iw-clean').textContent = "是";
    }

    reportImage.style.backgroundImage = `url(${marker.url})`;
    // console.log(marker);
    showActive ({
        "海攤": marker.beachTitle,
        "城市": marker.city,
        "回報日期": marker.date,
        "是否需要淨攤": marker.isClean? "需要" : "不需要",
        img: `<img src="${marker.url}" />`,
        // button: marker.activeId
        createActivityButton: marker.id
    });
};


function showActive(data) {
    const activeDetail = document.querySelector('#activeDetail');

    //tr list to table
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-striped');
    table.classList.add('activeDetail');
    for (key in data) {
        const keyCell = document.createElement('td');
        keyCell.setAttribute('scope', 'row');
        const valueCell = document.createElement('td');
        keyCell.innerHTML = key;
        valueCell.innerHTML = data[key];

        const tr = document.createElement('tr');

        if (key === "img") {
            keyCell.innerHTML = data[key];
            keyCell.setAttribute('colspan', '2')
            tr.appendChild(keyCell);
        }
        else if (key === "modifyActivityButton") {
            const alink = document.createElement('a');
            alink.href = "#active";
            const button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-warning');
            button.classList.add('editActive');
            button.dataset.id = data[key];
            button.setAttribute('type', 'button');
            button.textContent = "變更活動 >>";
            alink.appendChild(button);
            keyCell.innerHTML = alink.outerHTML;
            keyCell.setAttribute('colspan', '2')
            keyCell.classList.add('text-right');
            tr.appendChild(keyCell);
        }
        else if (key === 'createActivityButton') {
            const alink = document.createElement('a');
            alink.href = "#active";
            const button = document.createElement('button');
            button.classList.add('btn');
            button.classList.add('btn-warning');
            button.classList.add('tran2Active');
            button.dataset.id = data[key];
            button.setAttribute('type', 'button');
            button.textContent = "發起活動 >>";
            alink.appendChild(button);
            keyCell.innerHTML = alink.outerHTML;
            keyCell.setAttribute('colspan', '2')
            keyCell.classList.add('text-right');
            tr.appendChild(keyCell);
        }
        else {
            tr.appendChild(keyCell);
            tr.appendChild(valueCell);
        }
        table.appendChild(tr);
    }

    activeDetail.innerHTML = table.outerHTML;

    $('.editActive').on('click', (e) => {
        router.go('active');
        const id = $(e.currentTarget).data('id');
        gotoActive(false);

        const active = activityData.filter((item) => item.id === id).shift();
        // console.log(active);
        const contact = JSON.parse(active.contact)
        $('#activeName').val(active.title);
        $('#activityCity').val(active.city);
        // console.log(active.city);
        addActivityBeachOption(e, active.city);

        $('#activityBeach').val(active.beachName);
        addActivityLocationOption(e, active.beachName);
        // console.log(active.beachName);

        $('#activityLocation').val(active.beachTitle);
        $('#activeDescription').val(active.description);
        $('#activeOwner').val(contact.name);
        $('#activeOwnerPhone').val(contact.phone);
        $('#assembleDateTime').val(active.dateTime.slice(0, 10));

        $('#assembleLocation').val(active.place);
        $('#assembleURL').val(active.refURL);
    });

    $('.tran2Active').on('click', (e) => {
        router.go('active');
        gotoActive(true);

        const id = $(e.currentTarget).data('id');
        const report = reportData.filter((item) => item.id === id).shift();
        // console.log('report', report);
        // $('#activeName').val(report.title);
        $('#activityCity').val(report.city);
        addActivityBeachOption(e, report.city);
        //
        $('#activityBeach').val(report.beachName);
        addActivityLocationOption(e, report.beachName);
        //
        $('#activityLocation').val(report.title);
        // $('#activeDescription').val(report.description);

        // const contact = JSON.parse(report.contact)
        // $('#activeOwner').val(contact.name);
        // $('#activeOwnerPhone').val(contact.phone);

        // $('#assembleDateTime').val(report.dateTime.slice(0, 10));

        // $('#assembleLocation').val(report.place);
        // $('#assembleURL').val(report.refURL);
    })
}


var debug;
