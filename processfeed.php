<?php
/**
 * Created by PhpStorm.
 * User: mankind
 * Date: 28/02/15
 * Time: 6:39 PM
 */

ini_set('display_errors', 1);
require_once('twitterapi.php');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
                'oauth_access_token'        => "46932540-sAi9SK2YsU3MAAweSXYVoeerZNkuvZfAE8OuImVGm",
                'oauth_access_token_secret' => "NxwVjdpXZdReG6iY0gsaHAafnE3AqgloutnD4RecMS2Qj",
                'consumer_key'              => "LBcbDQ3TuzdGKozkXtF1gGCLD",
                'consumer_secret'           => "2LLg7ukIu5RmMdDXkphfbhFVj7MBkAhHGTXmnqBoEe3mscUKsg"
            );

$hashtag    = urlencode('#'.strtolower($_POST['hashtag'] ? $_POST['hashtag'] : false));
$lat        = $_POST['lat'] ? $_POST['lat'] : false;
$long       = $_POST['long'] ? $_POST['long'] : false;
$result = get_tweets_by_location( $hashtag, $lat, $long, $settings );

//Encode the $locations array in JSON format and print it out.
header('Content-Type: application/json');
echo json_encode($result);


/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
function get_tweets_by_location($hashtag, $lat, $long, $settings ){

    $url            = 'https://api.twitter.com/1.1/search/tweets.json';
    $getfield       = '?q='.$hashtag.'&geocode='.$lat.','.$long.',1mi&count=100';
    $requestMethod  = 'GET';
    $twitter        = new TwitterAPIExchange( $settings );
    $result         = json_decode( $twitter->setGetfield( $getfield )->buildOauth( $url, $requestMethod )->performRequest() );

    $mapdata = array();

    foreach( $result->statuses as $row )
    {
        $myrow = array(
            'timestamp' => $row->user->created_at,
            'lat'       => $row->geo->coordinates[0],
            'long'      => $row->geo->coordinates[1],
            'content'   => $row->text
        );
        array_push($mapdata, $myrow);
    }

    return $mapdata;
}