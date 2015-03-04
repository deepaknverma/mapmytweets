var data             	= [];
var places              = [];
var infoWindowContent   = [];
var markerArray			= [];
var bounds 	    		= new google.maps.LatLngBounds();
    
var mapOptions 	= {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

// Display a map on the page
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

// Default bounds for the map if not set
var defaultBounds = new google.maps.LatLngBounds
(
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
google.maps.event.addListener(searchBox, 'places_changed', function() 
{
    var places 	= searchBox.getPlaces();
	hashtag 	= places[0].name;
	lat 		= places[0].geometry.location.lat();
	long 		= places[0].geometry.location.lng();

    if (places.length == 0) 
    {
        return;
    }
    
    // call method to display markers
    displayMarkers(hashtag, lat, long);
});

// Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) 
{
    this.setZoom(14);
    google.maps.event.removeListener(boundsListener);
});


var displayMarkers = function(hashtag, lat, long){
	var responseMarkers = JSON.parse(getMarkers(hashtag, lat, long).responseText);

		$.each(responseMarkers, function(i) {

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
			data.push([ name + ', ' + location,responseMarkers[i].lat, responseMarkers[i].long, responseMarkers[i].image ]);
			infoWindowContent.push(['<div class="info-window"><p>'+responseMarkers[i].content+'</p><p>by <strong>' + responseMarkers[i].name + '</strong> on <i>' + responseMarkers[i].timestamp + '</i></p></div>']);

		});

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;

        // Loop through our array of markers & place each one on the map  
        for( i = 0; i < data.length; i++ ) 
        {
            
            var position = new google.maps.LatLng(data[i][1], data[i][2]);
            bounds.extend(position);
            
            marker = new google.maps.Marker({
                        position: position,
                        map     : map,
                        title   : data[i][0],
                        icon 	: data[i][3]
            }); 
            markerArray.push(marker);
            
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) 
            {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }
}

google.maps.event.addDomListener(window, 'load');

// Sets the map on all markers in the array.
var setAllMap = function(map) 
{
	for (var i = 0; i < markerArray.length; i++) 
  	{
		markerArray[i].setMap(map);
  	}
}

// Removes the markers from the map, but keeps them in the array.
var clearMarkers = function() 
{
	setAllMap(null);
}

// Function to get markers from the Twitter API
var getMarkers = function (hashtag,lat,long) {
    
    // lets store this in local storage
    storeLocalData(hashtag,lat,long);

	URL = 'processfeed.php'
	return $.ajax({
		type : 'POST',
		url : URL,
		async: false,
		data: 'hashtag='+hashtag+'&lat='+lat+'&long='+long,
		dataType : 'text',
		beforeSend: function(){
            $("#content").addClass("body-ajax-loading");
        },
        success : function(data){
        },
		complete:  function(){
            $("#content").removeClass("body-ajax-loading");
        }
	});
}

// Function to store data in HTML5 localStorage.
// Other options (mongoDB, PostgresSQL, Mysql)
var storeLocalData = function(searchTerm, lat, long) {

    var newObject = { "hastag": searchTerm, "count": 1, "lat": lat, "long": long };
    
	if ( localStorage ) 
    {
		// LocalStorage is supported!
        // Retrieve the last search from localStorage.
        searchItem = JSON.parse(localStorage.getItem('searchItem'));

        if( searchItem == null || searchItem.length == 0 || searchItem == 'undefined')
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

        localStorage.setItem('searchItem',JSON.stringify(searchItem));
        getSearchHistory();
	} else {
	   // No support. Use a fallback such as browser cookies or store on the server.
	}
}

// function to lookup for search term in json object
var lookup = function( searchTerm ) {

    // Retrieve the last search from localStorage.
    searchItem = JSON.parse(localStorage.getItem('searchItem'));

    for(var i = 0, len = searchItem.length; i < len; i++) {

        if( searchItem[ i ].hastag === searchTerm )
            return true;

    }
    return false;
}

// function to get history data from local storage, can use other options like MongoDB
var getSearchHistory = function() {
    // Retrieve the last search from localStorage.
    var searchItem = JSON.parse(localStorage.getItem('searchItem'));
    var list = '';
    
    if (searchItem == "undefined" || searchItem == null) {
        document.getElementById('search-container').innerHTML = "";
    } else {
        $.each( searchItem, function( key, value ) {
        list += '<li class="list-group-item"><a href="javascript:void(0)" onclick="displayMarkers(\''+value.hastag+'\','+value.lat+','+value.long+')">' + value.hastag + '</a><span class="badge">'+ value.count+'</span></li>';
    });
    document.getElementById('search-container').innerHTML = list;
    }
}

// function to clear history
var clearHistory = function() {

	$('.fa-trash').addClass('fa-spin');
	
	localStorage.setItem('searchItem', null);
	
	setTimeout(function(){
		$('.fa-trash').removeClass('fa-spin');
		getSearchHistory();
	}, 2000);

}

var msg = "<p>This is a simple implementation of Tweeter feeds to be displayed on google maps.\
			When a user search for any location it get the coordinates and fetch tweets from entered location using twitter API. \
			There is a lag in fetching results from API but can be improved.</p>\
			<h4>Further Improvements:</h4><hr>\
			<ul><li>Currently not clearing existing markers but can be removed by calling clearMarkers method</li>\
			<li>Search history is currently stored in browser but can be stored in MongoDB using specified CRUD class (class.mongo.php)</li>\
			<li>Currently making ajax call to retrieve tweets from twitter api which is slow. Need to find a way to make it either asyncronous or use cache to store tweet</li>\
			</ul>";

moreInfo = function(){
	bootbox.dialog({
		message: msg,
		title: "Description",
		buttons: {
			success: {
				label: "Close",
				className: "btn-success",
				callback: function() {
					return;
				}
			}
		}
	}); 
}