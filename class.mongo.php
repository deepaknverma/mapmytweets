<?php
/**
 * Class containing CRUD methods to work with MongoDB 
 * 
 * PHP version 5.3.10
 * 
 * Created by PhpStorm.
 * User: mankind
 * Date: 05/03/15
 * Time: 1:39 PM
 * 
 * @author   Deepak Verma <info@deepakverma.com.au>
 * @license  MIT License
 * 
 **/

Class db {

   const dbUser = "root";
   const dbPass = "mongo";
   const dbName = "searchitem";

   private static $instance;
   private static $dbs;
   
   private function __construct() { } 

   /**
    * @description Method to establish connection
    * @attribute null
    * 
    * @return  object
    * 
    **/
   public static function conn()
    {
        try
        {
            $mongo = new Mongo("mongodb://".self::dbUser.":".self::dbPass."@localhost/".self::dbName."");
            self::$dbs = $mongo->selectDB(self::dbName);
            self::$instance = new db(); 
        }
        catch(MongoConnectionException $e)
        {  
            die('Connection Failed' );
        }
        return self::$instance;
    }


   /**
    * @description Method to find record
    * @attribute string array
    * 
    * @return  array
    * 
    **/
    public function select($collectionName, $fields = array(), $where = array(), $sort = array(), $limit = 0)
    { 
        $cur = self::$dbs->$collectionName->find($where, $fields)->limit($limit);
        $cur->sort($sort);

        $this->docs = null; 
        while( $docs = $cur->getNext())
        {
        $this->docs[] = $docs;  
        }
        return $this->docs;
    }

   /**
    * @description Method to insert record
    * @attribute object string
    * 
    * @return  string
    * 
    **/
    public function insert($obj, $collectionName)
    {
        $collection = self::$dbs->$collectionName;
        try{
            $collection->insert($obj, array('w'=>true) );
            return  ( !empty($obj['_id']) )?1:0;
        } catch (MongoException $e) {
            return "Can't insert!n";
        }      
    }    

   /**
    * @description Method to update record
    * @attribute string array
    * 
    * @return  string num
    * 
    **/
    public function update($collectionName, $criteria, $update, $confirm)
    {    

        $collection = self::$dbs->$collectionName;
        try
        {
            $collection->update($criteria,$update, array("multiple" => true));
            $num_rows = $collection->find($confirm)->count();
            return ( !empty($num_rows) )?$num_rows:0;
        } catch (MongoException $e) {
            return "Can't update!n";
        }         
    }    

   /**
    * @description Method to delete record
    * @attribute string array
    * 
    * @return  string num
    * 
    **/
    public function remove($collectionName, $criteria)
    {    

        $collection = self::$dbs->$collectionName;
        try
        {
            $collection->remove($criteria);
            $num_rows = $collection->find($criteria)->count();
            return ( empty($num_rows) )?1:0;
        } catch (MongoException $e) {
            return "Can't update!n";
        }        
    }        

}