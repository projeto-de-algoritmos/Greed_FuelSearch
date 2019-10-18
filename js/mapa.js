var map;
var directionsDisplay; // Instanciaremos ele mais tarde, que será o nosso google.maps.DirectionsRenderer
var directionsService = new google.maps.DirectionsService();
var service;
var infowindow;
var latitude_partida; 
var longitude_partida;

function initialize() {
   directionsDisplay = new google.maps.DirectionsRenderer(); // Instanciando...
   var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
 
   infowindow = new google.maps.InfoWindow();

   var options = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
 
   map = new google.maps.Map(document.getElementById("mapa"), options);
   directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado
}
 
initialize();
 
$("form").submit(function(event) {
   event.preventDefault();
 
   var enderecoPartida = $("#txtEnderecoPartida").val();
   var enderecoChegada = $("#txtEnderecoChegada").val();
 
   var geocoder= new google.maps.Geocoder();

   geocoder.geocode({ 'address': enderecoPartida + ', Brasil', 'region': 'BR' }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
              latitude_partida = results[0].geometry.location.lat();
              longitude_partida = results[0].geometry.location.lng();
              localStorage.setItem('Partida', [latitude_partida, longitude_partida]);
          }
      }
   });

   geocoder.geocode({ 'address': enderecoChegada + ', Brasil', 'region': 'BR' }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();

              localStorage.setItem('Chegada', [latitude, longitude]);
          }
      }
   });

   var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
      origin: enderecoPartida, // origem
      destination: enderecoChegada, // destino
      travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
   };
 
   directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
         directionsDisplay.setDirections(result); // Renderizamos no mapa o resultado
      }
   });

   // var request = {
   //        query: 'Museum of Contemporary Art Australia',
   //        fields: ['name', 'geometry'],
   // };  

   // service = new google.maps.places.PlacesService(map);

   //  service.findPlaceFromQuery(request, function(results, status) {
   //    if (status === google.maps.places.PlacesServiceStatus.OK) {
   //      for (var i = 0; i < results.length; i++) {
   //        createMarker(results[i]);
   //      }

   //      map.setCenter(results[0].geometry.location);
   //    }
   //  });

   //  function createMarker(place) {
   //    var marker = new google.maps.Marker({
   //      map: map,
   //      position: place.geometry.location
   //    });

   //    google.maps.event.addListener(marker, 'click', function() {
   //      infowindow.setContent(place.name);
   //      infowindow.open(map, this);
   //    });
   //    }
   latitude_teste = localStorage.getItem('Partida');
   console.log("Latitude" + latitude_teste);

   var localizacao_origem = new google.maps.LatLng(latitude_partida,longitude_partida);
   var pyrmont1 = new google.maps.LatLng(-33.8665433,151.1956316);
   var pyrmont = new google.maps.LatLng(latitude_teste);

   console.log(pyrmont)

    var request = {
      location: pyrmont1,
      radius: '5000000',
      type: ['gas_station']
    };

   service = new google.maps.places.PlacesService(map);
   service.nearbySearch(request, callback);

   function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        console.log("nearbySearch returned " + results.length + " results")
        results.map(function(item) {
          var id = item.place_id;
          service.getDetails({
            placeId: id
          }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              createMarker(item);
            } else console.log("error: status=" + status);
          });
        });
      }
      else{
         console.log("Entrou: " + status + " Resultados:" + results);
      }
   }
});
 