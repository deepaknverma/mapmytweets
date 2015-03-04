<?php
/**
 * 
 * PHP version 5.3.10
 * 
 * Created by PhpStorm.
 * User: mankind
 * Date: 02/03/15
 * Time: 12:40 PM
 * 
 * @author   Deepak Verma <info@deepakverma.com.au>
 * @license  MIT License
 * 
 **/
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>

        <title>Live Demo of Google Maps Geocoding Example with PHP</title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
        <meta charset="utf-8">

        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet">
        <link href="assets/css/style.css" rel="stylesheet" type="text/css">
        <link href="assets/css/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">

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
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
        <script src="assets/js/bootbox.min.js"></script>

    </head>

<body>
    <div id="content" class="row">

        <div id="history-container" class="col-md-2 col-sm-2 col-lg-2">

            <div class="col-md-12 col-sm-12 col-lg-12">

                <h3><i class="fa fa-history"></i> Search History: <a href="javascript:void(0);" onclick="clearHistory();" class="pull-right"><i class="fa fa-trash txt-color-white"></i></a></h3><hr>
                <ul id="search-container" class="list-group"></ul>

            </div>

            <div class="info-box">
            	<hr>
            	<a href="javascript:void(0);" onclick="moreInfo();" class="btn btn-default col-md-12"> <i class="fa fa-info-circle"></i> Information</a>    
            </div>            

        </div> <!-- END #history-container -->

        <div class="col-md-10 col-sm-10 col-lg-10">
        
                <div class="col-md-3 col-md-offset-3">
                    <input id="input-address" class="controls" type="text" placeholder="Search your area">
                </div>

                <!-- google map will be shown here -->
                <div id="map-canvas" style="height:800px;">Loading map...</div>
                <div id='map-label'>Map shows approximate location.</div>

        </div> <!-- END col-md-10 -->
    </div> <!-- END row -->
</body>

    <!-- JavaScript to show google map -->
    <script src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false&extension=.js&libraries=places"></script>
    <script type="text/javascript" src="assets/js/init.js"></script>
</html>

