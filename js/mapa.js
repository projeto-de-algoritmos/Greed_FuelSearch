var map;

var directionsDisplay; 

var directionsService = new google.maps.DirectionsService();
 
function initialize() {
   directionsDisplay = new google.maps.DirectionsRenderer();

   var latlng = new google.maps.LatLng(-18.8800397, -47.05878999999999);
 
   var options = {
      zoom: 10,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
 
   map = new google.maps.Map(document.getElementById("mapa"), options);
   directionsDisplay.setMap(map); // Relacionamos o directionsDisplay com o mapa desejado
   directionsDisplay.setPanel(document.getElementById("trajeto-texto")); 
 
initialize();
 
$("form").submit(function(event) {
   event.preventDefault();
 
   var enderecoPartida = $("#txtEnderecoPartida").val();
   var enderecoChegada = $("#txtEnderecoChegada").val();

   var geocoder= new google.maps.Geocoder();

   geocoder.geocode({ 'address': enderecoPartida + ', Brasil', 'region': 'BR' }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
              localStorage.setItem('Partida', [latitude, longitude]);
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
});