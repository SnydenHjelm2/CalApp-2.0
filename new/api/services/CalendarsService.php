<?php

require_once __DIR__ . "/../repository/DBAccess.php";
require_once __DIR__ . "/UsersCalendarsService.php";

class CalendarsService{

    public static function calendarsGetAll(){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll();

        if(empty($calendarTable)){
            throw new Exception("No calendars found");
        } else {
            return $calendarTable;
        }
    }

    public static function calendarsGetById($input){
        $db = new DBAccess("calendars");
        $calendarTableById = $db->findById($input["id"]);

        if(empty($calendarTableById)){
            throw new Exception("No calendars found by id");
        } else {
            return $calendarTableById;
        }
    }

    public static function calendarsPost($input){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll();

        $isPublic = 0;

        if(isset($input["isPublic"]) && $input["isPublic"] == "1"){
            $isPublic = 1;
        }
        

        $newData = [
            "id" => uniqid(),
            "name" => $input["name"],
            "description" => $input["description"],
            "isPublic" => $isPublic,
            "isDeleted" => 0
        ];

        $addUser = [
            "userId" => $input["creatorId"],
            "calId" => $newData["id"],
            "canAll" => 1
        ];

        $db->postData($newData);


        //Testar skapa en ny users_calendars-post, om det inte går så tar vi bort datan.
        try {
            $newUserCal = UsersCalendarsService::addUserToCalendar($addUser);    
        } catch(Exception $exc) {
            $db->deleteData($newData);
            throw new Exception($exc->getMessage());
        }
        
    }

    public static function calendarsPatch($input){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll(); 


        if (!$db->findById($input["calId"])){
            throw new Exception("Calendar does not exist");
        }

        $userRelations = UsersCalendarsService::getAllRelationsByUser($input["userId"]);
        $user_cal = array_filter($userRelations, fn($x) => $x["calId"] == $input["calId"]);
        if ($user_cal["canAll"] == 0){
            throw new Exception("Not allowed.");
        }

        $changeData = [];
        foreach($input as $key => $data){
            if($key != "id"){
                $changeData[$key] = $data;
            }
        }
        if(!count($changeData) > 1){
            throw new Exception("No values to be changed");
        } else {
            return $db->patchData($input["id"], $changeData);
        }

    }

    public static function calendarsDelete($input){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll();
        
        $checkCal = false;

        foreach($calendarTable as $cal){
            if($input["id"] == $cal["id"]){
                $checkCal = true;
                break;
            }
        }
        
        if($checkCal){
            //Kolla om man får deleta
            $userRelations = UsersCalendarsService::getAllRelationsByUser($input["userId"]);
            $user_cal = array_filter($userRelations, fn($x) => $x["calId"] == $input["calId"]);
            if ($user_cal["canAll"] == 0 || $user_cal["canDelete"] == 0){
                throw new Exception("Not allowed.");
            }



            return $db->deleteData($input["id"]);
        } else {
            throw new Exception("No calendar exists to delete");
        }
    }




    
}




?>