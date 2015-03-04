function initialize() {
    var bounds 	            = new google.maps.LatLngBounds();
    var markers             = [];
    var places              = [];
    var infoWindowContent   = [];

    var mapOptions 	= {
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Display a map on the page
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Default bounds for the map if not set
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

        if (places.length == 0) {
            return;
        }

        // console.log('Markers: '+markers);
        // //Clearing markers, if they exist
        // if(markers && markers.length !== 0){
        //     for(var i = 0; i < markers.length; ++i){
        //         markers[i].setMap(null);
        //     }
        //     markers.length = 0;
        // }

        var responseMarkers = JSON.parse(getMarkers(hashtag, lat, long).responseText);

		$.each(responseMarkers, function(i) {
            //markers.push([responseMarkers[i].name, responseMarkers[i].location, responseMarkers[i].lat, responseMarkers[i].long]);
            var name    = hashtag + ' tweet';
            var location= hashtag;

            if( responseMarkers[i].name ) 
            {
                name = responseMarkers[i].name
            }

            if( responseMarkers[i].location )
            {
                location = responseMarkers[i].location;
            }
			markers.push([ name + ', ' + location,responseMarkers[i].lat, responseMarkers[i].long]);
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
                        map     : map,
                        title   : markers[i][0]
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

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
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

    var newObject = { "hastag": searchTerm, "count": 1 };
    var isFound = false;
	if ( localStorage ) 
    {
		// LocalStorage is supported!
        // Retrieve the last search from localStorage.
        searchItem = JSON.parse(localStorage.getItem('searchItem'));

        if( searchItem == null || searchItem.length == 0 )
        {
            var searchItem = [];
            searchItem.push(newObject);          
        } else {
           $.each( searchItem, function( key, value ) 
           {
                if(searchTerm  == value.hastag)
                {
                    value.count = value.count + 1;
                }

            });
            if( !lookup( searchTerm ) ) {
                searchItem.push(newObject);

            }
           
        }
        //searchItem.push(searchTerm);
        localStorage.setItem('searchItem',JSON.stringify(searchItem));
        //getSearchHistory();
	} else {
	   // No support. Use a fallback such as browser cookies or store on the server.
	}
}

function lookup( searchTerm ){

    // Retrieve the last search from localStorage.
    searchItem = JSON.parse(localStorage.getItem('searchItem'));

    for(var i = 0, len = searchItem.length; i < len; i++) {
        if( searchItem[ i ].hastag === searchTerm )
            return true;
    }
    return false;
}

function getSearchHistory(){
    // Retrieve the last search from localStorage.
    var searchItem = JSON.parse(localStorage.getItem('searchItem'));
    var list = '';
    
    if (searchItem == "undefined" || searchItem == null) {
        //document.getElementById('search-container').innerHTML = "<li>&nbsp;</li>";
    } else {
        $.each( searchItem, function( key, value ) {
        list += '<li class="list-group-item">' + value.hastag + '<span class="badge">'+ value.count+'</span></li>';
    });
    document.getElementById('search-container').innerHTML = list;
    }
}