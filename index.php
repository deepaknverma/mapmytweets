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

        <script src="assets/js/jquery.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                $('#map_canvas').css({ height: $(window).innerHeight() });
                $(window).resize(function(){
                    $('#map_canvas').css({ height: $(window).innerHeight() });
                });
                
                // Display Search History
                getSearchHistory();

            });
        </script>

    </head>

<body>
    <div class="row">
        <div id="history-container" class="col-md-2">
            <div class="col-md-12">
                <h3>Search History:</h3><hr>
                <ul id="search-container" class="list-group"></ul>    
            </div>
        </div>
        <div class="col-md-10">
        
                <div class="col-md-3 col-md-offset-3">
                    <input id="input-address" class="controls" type="text" placeholder="Search your area">
                </div>

                <!-- google map will be shown here -->
                <div id="map-canvas" style="height:800px;">Loading map...</div>
                <div id='map-label'>Map shows approximate location.</div>

        </div> <!-- END col-md-11 -->
    </div> <!-- END row -->
</body>

    <!-- JavaScript to show google map -->
    <script src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false&extension=.js&libraries=places"></script>
    <script type="text/javascript" src="assets/js/init.js"></script>
</html>

