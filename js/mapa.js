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

$("form").submit( async function(event) {
  event.preventDefault();

  var enderecoPartida = $("#txtEnderecoPartida").val();
  var enderecoChegada = $("#txtEnderecoChegada").val();

  var geocoder= new google.maps.Geocoder();

  await geocoder.geocode({ 'address': enderecoPartida + ', Brasil', 'region': 'BR' }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        latitude_partida = results[0].geometry.location.lat();
        longitude_partida = results[0].geometry.location.lng();
        localStorage.setItem('PartidaLat', latitude_partida);
        localStorage.setItem('PartidaLong', longitude_partida);
      }
    }
  });

  await geocoder.geocode({ 'address': enderecoChegada + ', Brasil', 'region': 'BR' }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();

        localStorage.setItem('ChegadaLat', latitude);
        localStorage.setItem('ChegadaLong', longitude);
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

  function createMarker(place) {
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(map, this);
    });
  }
  const latitudePartida = Number(localStorage.getItem('PartidaLat'));
  const longitudePartida = Number(localStorage.getItem('PartidaLong'));
  const latitudeChegada = Number(localStorage.getItem('ChegadaLat'));
  const longitudeChegada = Number(localStorage.getItem('ChegadaLong'));


  var localizacao_origem = new google.maps.LatLng(latitude_partida,longitude_partida);
  var pyrmont1 = new google.maps.LatLng(-33.8665433,151.1956316);
  var sw = new google.maps.LatLng(latitudePartida, longitudeChegada);
  console.log('partida: ' + sw);
  var ne = new google.maps.LatLng(latitudeChegada, longitudePartida);
  console.log('chegada: '+ ne);
  var pyrmont = new google.maps.LatLngBounds(sw, ne);

  console.log(pyrmont)

  var request = {
    bounds: pyrmont,
    type: ['gas_station']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log("nearbySearch returned " + results.length + " results")
      for (var i = 0; i < results.length; i++) {
        console.log(results[i].geometry.location)
        var lat = results[i].geometry.location.lat();
        var long = results[i].geometry.location.lng();
        var id = results[i].place_id;
        console.log('ini');
        await sleep(2000);
        console.log('fim');
        createMarker(results[i]);
      }
      // results.map( async function(item) {
      //   console.log(item.geometry.location)
      //   var lat = item.geometry.location.lat();
      //   var long = item.geometry.location.lng();
      //   var id = item.place_id;
      //   console.log('ini');
      //   await sleep(2000);
      //   console.log('fim');
      //   createMarker(item);
      //   service.getDetails({
      //     placeId: id
      //   }, function(place, status) {
      //     if (status === google.maps.places.PlacesServiceStatus.OK) {
      //       // createMarker(item);
      //       console.log();
      //     } else console.log("error: status=" + status);
      //   });
      // });
    }
    else{
      console.log("Entrou: " + status + " Resultados:" + results);
    }
  }

  function haversine(lat1, lon1, lat2, lon2) {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }

    var R = 6371; // km
    //has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = x1.toRad();
    var x2 = lon2-lon1;
    var dLon = x2.toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return(d);
  }


  function selectingBreakpoints(latitudePartida, longitudePartida, latitudeChegada, longitudeChegada, postos, autonomia) {
    inicio = {lat: latitudePartida, lon: longitudePartida}
    fim = {lat: latitudeChegada, lon: longitudeChegada}

    // Objeto com postos deve ser enviado neste formato:  posto: {lat: '', lon: ''}
    postos = {
      ...postos,
      inicio: inicio,
      fim: fim
    }
    distPosto = {}

    for (var posto in postos) {
      distPosto[posto] = haversine(Number(inicio.lat), Number(inicio.lon), Number(postos[posto].lat), Number(postos[posto].lon))
    }

    postosOrdenados = Object.keys(distPosto).sort(function(a,b){return distPosto[a]-distPosto[b]})

    postosVisitados = {};

    x = 0;
    for (var i = 0; i < postosOrdenados.length; i++) {
      postoAtual = postosOrdenados[i];
      distAtual = distPosto[postoAtual];

      if (distAtual > (x + autonomia)) {
        postoAnt = postosOrdenados[--i];
        distAnt = distPosto[postoAnt];
        if (distAnt !== x) {
          x = distAnt;
          postosVisitados[postoAnt] = distAnt;
        } else {
          return null;
        }
      }
    }

    return postosVisitados;
  }

  // postos = {
  //   p1: {lat: '42.806911', lon: '-72.290611'},
  //   p2: {lat: '42.816911', lon: '-72.290611'},
  //   p3: {lat: '42.856911', lon: '-72.290611'},
  //   p4: {lat: '42.866911', lon: '-72.290611'},
  //   p5: {lat: '42.876911', lon: '-72.290611'},
  //   p6: {lat: '42.906911', lon: '-72.290611'},
  //   p7: {lat: '42.916911', lon: '-72.290611'},
  //   p8: {lat: '42.956911', lon: '-72.290611'},
  //   p9: {lat: '42.996911', lon: '-72.290611'},
  // }
  // console.log(selectingBreakpoints(42.75, -72.290611, 43, -72.290611, postos, 7.5));
});
