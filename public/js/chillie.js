var theMap;
var theMarker;

function initMap() {
  var mapOptions = {
    center: { lat: 28.782232, lng: -81.3604531 },
    zoom: 7,
    disableDefaultUI: true
    }

    theMap = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

  window.setTimeout(function () {
    theMap.setCenter({ lat: 28.782232, lng: -81.3604531 });
    theMap.setZoom(10);
  }, 1000);
  window.setTimeout(function () {
    theMap.setCenter({ lat: 28.782232, lng: -81.3604531 });
    theMap.setZoom(13);
    theMarker.setTitle("K & W");
    }, 1750);

  theMarker = new google.maps.Marker({
    map: theMap,
    animation: google.maps.Animation.DROP,
    position: { lat: 28.782232, lng: -81.3604531 },
    });

  theMarker.addListener('click', function () {
    window.setTimeout(function () {
      theMap.setCenter({ lat: 28.782232, lng: -81.3604531 });
      theMap.setZoom(15);
    }, 1000);
  });
}
