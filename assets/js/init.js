function initialize() {
    var bounds 		= new google.maps.LatLngBounds();
    var markers 	= [];
    var mapOptions 	= {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Display a map on the page
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-33.8902, 151.1759),
        new google.maps.LatLng(-33.8474, 151.2631)
    );
    map.fitBounds(defaultBounds);
      
    // Create the search box and link it to the UI element.
    /** @type {HTMLInputElement} */
    var input = (document.getElementById('input-address'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    /** @type {HTMLInputElement} */           
    var searchBox = new google.maps.places.SearchBox((input));

    // [START region_getplaces]
    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
        var places 	= searchBox.getPlaces();
		hashtag 	= places[0].name;
		lat 		= places[0].geometry.location.k;
		long 		= places[0].geometry.location.B;

        // if (places.length == 0) {
        //     return;
        // }
        
        // if( typeof markers !== 'undefined' ) {
        // 	for ( var i = 0, marker; marker = markers[i]; i++ ) {
    	   //      marker.setMap(null);
	       //  }
        // }

        // For each place, get the icon, place name, and location.
		markers = [];

        // Info Window Content
        var infoWindowContent = [];

        var responseMarkers = JSON.parse(getMarkers(hashtag, lat, long).responseText);

		$.each(responseMarkers, function(i) {
			markers.push(['London Eye, London',responseMarkers[i].lat, responseMarkers[i].long]);
			infoWindowContent.push(['<p>'+responseMarkers[i].content+'</p>']);
		});

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        // Loop through our array of markers & place each one on the map  
        for( i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: markers[i][0]
            });            

            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }
    });

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

// Function to get markers from the Twitter API
function getMarkers(hashtag,lat,long) {
    
    // lets store this in local storage
    storeLocalData(hashtag);

	URL = 'processfeed.php'
	return $.ajax({
		type : 'POST',
		url : URL,
		async: false,
		data: 'hashtag='+hashtag+'&lat='+lat+'&long='+long,
		dataType : 'text',
		beforeSend: function(){
            $(".container-fluid").addClass("widget-body-ajax-loading");
        },
        success : function(data){
        },
		complete:  function(){
            $(".container-fluid").removeClass("widget-body-ajax-loading");
        }
	});
}

// Function to store data in HTML5 localStorage.
// Other options (mongoDB, PostgresSQL, Mysql)
function storeLocalData(searchTerm) {
	if (localStorage) {
		// LocalStorage is supported!
        // Retrieve the last search from localStorage.
        var searchItem = JSON.parse(localStorage.getItem('searchItem'));

        searchItem.push(searchTerm);
		localStorage.setItem('searchItem',JSON.stringify(searchItem));
	} else {
	   // No support. Use a fallback such as browser cookies or store on the server.
	}
}