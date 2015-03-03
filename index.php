<?php
/**
 * Created by PhpStorm.
 * User: mankind
 * Date: 28/02/15
 * Time: 1:39 PM
 */
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>

        <title>Live Demo of Google Maps Geocoding Example with PHP</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8">

        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="assets/css/style.css" rel="stylesheet" type="text/css">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                $('#map_canvas').css({ height: $(window).innerHeight() });
                $(window).resize(function(){
                    $('#map_canvas').css({ height: $(window).innerHeight() });
                });

                // Retrieve the last search from localStorage.
                var searchItem = JSON.parse(localStorage.getItem('searchItem'));

                var list = '';
                if (searchItem != "undefined" || searchItem != "null") {
                    $.each( searchItem, function( key, value ) {
                        list += '<li>' + value + '</li>';
                    });
                    document.getElementById('search-container').innerHTML = list;
                } else {
                    document.getElementById('search-container').innerHTML = "<li>&nbsp;</li>";
                }
            });
        </script>

    </head>

<body>
    <div class="container-fluid">
        <div class="col-md-3 col-md-offset-3">
            <input id="input-address" class="controls" type="text" placeholder="Search your area">
        </div>
        <!-- google map will be shown here -->
        <div id="map-canvas" style="height:800px;">Loading map...</div>
        <div id='map-label'>Map shows approximate location.</div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h2>Search History:</h2><hr>
            <ul id="search-container">
                
            </ul>
        </div>
    </div>

</body>

    <!-- JavaScript to show google map -->
    <script src="http://maps.googleapis.com/maps/api/js?v=3&sensor=false&extension=.js&libraries=places"></script>
    <script type="text/javascript" src="assets/js/init.js"></script>
</html>

