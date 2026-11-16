<?php

require_once __DIR__ . "/../repository/DBAccess.php";
require_once __DIR__ . "/UsersCalendarsService.php";

class CalendarsService{

    //Returnera bara tom array om inga finns
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

        if (!is_int($input["isPublic"])) {
            throw new Exception("Invalid type", 400);
        }

        if ($input["isPublic"] < 0 || $input["isPublic"] > 1) {
            Throw new Exception("Invalid value", 400);
        }

        $newData = [
            "id" => uniqid(),
            "name" => $input["name"],
            "description" => $input["description"],
            "isPublic" => $input["isPublic"],
            "isDeleted" => 0
        ];

        $addUser = [
            "userId" => $input["creatorId"],
            "calId" => $newData["id"],
            "isCreator" => 1,
            "canAll" => 1
        ];


        //Testar skapa en ny users_calendars-post, om det inte går så tar vi bort datan.
        try {
            $result = $db->postData($newData);  
            $newUserCal = UsersCalendarsService::addUserToCalendar($addUser);
            return $result;
        } catch(Exception $exc) {
            throw new Exception($exc->getMessage(), 404);
        }
        
    }

    public static function calendarsPatch($input){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll(); 
        $cal = $db->findById($input["calId"]);

        $name = $input["name"] ?? null;
        $desc = $input["description"] ?? null;
        $isPublic = $input["isPublic"] ?? null;
        $isDeleted = $input["isDeleted"] ?? null;

        if (!$cal){
            throw new Exception("Calendar does not exist", 404);
        }

        if ($isPublic !== null) {
            if (!is_int($isPublic)) throw new Exception("Invalid type", 400);

            if ($isPublic < 0 || $isPublic > 1) throw new Exception("Invalid value", 400);
        }

        if ($isDeleted !== null) {
            if (!is_int($isDeleted)) throw new Exception("Invalid type", 400);

            if ($isDeleted < 0 || $isDeleted > 1) throw new Exception("Invalid value", 400);
        }

        $userRelations;
        try {
            $userRelations = UsersCalendarsService::getAllRelationsByUser($input["userId"]);
        } catch (Exception $e) {
            throw new Exception($e->getMessage(), 404);
        }
        
        $user_cal = array_find($userRelations, fn($x) => $x["calId"] == $input["calId"]);

        if (!$user_cal) throw new Exception("User is not in cal", 400);

        if ($user_cal["canAll"] == 0){
            throw new Exception("Not allowed.", 401);
        }

        $inputData = [
            "name" => $name,
            "description" => $desc,
            "isPublic" => $isPublic,
            "isDeleted" => $isDeleted
        ];
        $changeData = [];
        foreach($inputData as $key => $value) {
            if ($value !== null) {
                $changeData[$key] = $value;
            }
        }

        if(count($changeData) < 1){
            throw new Exception("No values to be changed", 400);
        } else {
            return $db->patchData($cal["id"], $changeData);
        }

    }

    public static function calendarsDelete($input){
        $db = new DBAccess("calendars");
        $calendarTable = $db->getAll();
        
        $cal = $db->findById($input["calId"]);
        
        if($cal){
            //Kolla om man får deleta


            $userRelations;
            try {
                $userRelations = UsersCalendarsService::getAllRelationsByUser($input["userId"]);
            } catch(Exception $e) {
                throw new Exception($e->getMessage(), 404);
            }
            $user_cal = array_find($userRelations, fn($x) => $x["calId"] == $input["calId"]);
            if (!$user_cal) throw new Exception("User not in cal", 400);
            if ($user_cal["canAll"] == 0 && $user_cal["canDelete"] == 0){
                throw new Exception("Not allowed.", 401);
            }



            return $db->deleteData($input["calId"]);
        } else {
            throw new Exception("Calendar not found", 404);
        }
    }




    
}




?>