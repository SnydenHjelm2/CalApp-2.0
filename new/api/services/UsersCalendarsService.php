<?php

require_once __DIR__ . "/../repository/DBAccess.php";

class UsersCalendarsService {
    public static function getAll(){
        $db = new DBAccess("users_calendars");
        $relations = $db->getAll();

        if (empty($relations)) {
            throw new Exception("No relations found.");
        }

        return $relations;
    }

    public static function getRelationById($id){
        $db = new DBAccess("users_calendars");
        $relation = $db->findById($id);

        if (!$relation) {
            throw new Exception("Relation not found.");
        }

        return $relation;
    }

    public static function getAllRelationsByCalId($calId){
        // Validate calendar exists
        $dbCals = new DBAccess("calendars");
        if (!$dbCals->findById($calId)) {
            throw new Exception("Calendar not found.", 404);
        }

        $db = new DBAccess("users_calendars");
        $relations = $db->getAll();

        return array_values(
            array_filter($relations, fn($x) => $x["calId"] == $calId)
        );
    }

    public static function getAllRelationsByUser($userId){
        // Validate user exists
        $dbUsers = new DBAccess("users");
        if (!$dbUsers->findById($userId)) {
            throw new Exception("User not found.");
        }

        $db = new DBAccess("users_calendars");
        $relations = $db->getAll();

        return array_values(
            array_filter($relations, fn($x) => $x["userId"] == $userId)
        );
    }

    public static function getAllEventsByCalId($calId){
        // Validate user exists
        $dbCals = new DBAccess("calendars");
        if (!$dbUsers->findById($calId)) {
            throw new Exception("Calendar not found.");
        }

        $db = new DBAccess("events");
        $events = $db->getAll();

        return array_values(
            array_filter($events, fn($x) => $x["calId"] == $calId)
        );
    }
    


 
    // Requires: userId, calId, adminId
    public static function addUserToCalendar($input){
        $userId  = $input["userId"];
        $calId = $input["calId"];
        $isCreator = $input["isCreator"];
        $canAll = $input["canAll"];
        $canDelete = $input["canDelete"] ?? 0;
        $canAddEvent = $input["canAddEvent"] ?? 0;
        $canRemoveEvent = $input["canRemoveEvent"] ?? 0;
        $canPostMsg = $input["canPostMsg"] ?? 0;
        $canAddUser = $input["canAddUser"] ?? 0;
        $canRemoveUser = $input["canRemoveUser"] ?? 0;
        $hasPinned = $input["hasPinned"] ?? 0;

        $dbUsers  = new DBAccess("users");
        $dbCals = new DBAccess("calendars");
        $dbUG = new DBAccess("users_calendars");

        // Finns user?
        if (!$dbUsers->findById($userId)) {
            throw new Exception("User not found.", 404);
        }

        // Finns cal?
        if (!$dbCals->findById($calId)) {
            throw new Exception("Calendar not found.", 404);
        }

        // finns reda u_g?
        $existing = $dbUG->getAll();
        foreach ($existing as $rel) {
            
            if ($rel["userId"] == $userId && $rel["calId"] == $calId) {
                throw new Exception("Relation already exists.", 409);
            }
        }

        $bools = [
            "isCreator" => $isCreator,
            "canDelete" => $canDelete,
            "canAddEvent" => $canAddEvent,
            "canRemoveEvent" => $canRemoveEvent,
            "canPostMsg" => $canPostMsg,
            "canAddUser" => $canAddUser,
            "canRemoveUser" => $canRemoveUser,
            "hasPinned" => $hasPinned,
            "canAll" => $canAll
        ];

        foreach ($bools as $item) {
            if (!is_int($item)) {
                throw new Exception("Invalid type", 400);
            }

            if ($item < 0 || $item > 1) {
                throw new Exception("Invalid value", 400);
            }
        }

        $newRelation = [
            "id"      => uniqid(),
            "userId"  => $userId,
            "calId" => $calId,
            ...$bools
        ];

        return $dbUG->postData($newRelation);
    }





    //  Requirs: id (relation id), adminId
    public static function removeUserFromCal($input) {
        $userId = $input["userId"];
        $calId = $input["calId"];
        $init = $input["init"]; //userId av den user som försöker ta bort en connection (den som är inloggad exempelvis)

        $dbUG = new DBAccess("users_calendars");
        $dbU = new DBAccess("users");
        $dbC = new DBAccess("calendars");

        if(!$dbU->findById($userId)){
            throw new Exception("User not found", 404);
        }
        if(!$dbC->findById($calId)){
            throw new Exception("Calendar not found", 404);
        }

        $relations = $dbUG->getAll();
        $exists = array_find($relations, fn($x) => $x["userId"] === $userId && $x["calId"] === $calId);
        if (!$exists) {
            throw new Exception("Relation not found.", 404);
        }

        //Authorization check
        // $connsFromCal = self::getAllRelationsByCalId($calId);
        // $initUser = array_find($connsFromCal, fn($x) => $x["userId"] === $init);
        // if ($initUser["canDelete"] === 0 && $initUser["canAll"] === 0) {
        //     throw new Exception("Missing pemissions", 401);
        // }

        $success = $dbUG->deleteData($exists["id"]);
        if ($success){
            return ["message" => "Deleted successfully!"];
        }
    }



    //  Requires: id (relation id), adminId? Denna inte klar.
    public static function makeUserCalAdmin($input)
    {
        $userId  = $input["userId"];
        $calId = $input["calId"];
        $canAll = $input["canAll"] ?? null;
        $canDelete = $input["canDelete"] ?? null;
        $canAddEvent = $input["canAddEvent"] ?? null;
        $canRemoveEvent = $input["canRemoveEvent"] ?? null;
        $canPostMsg = $input["canPostMsg"] ?? null;
        $canAddUser = $input["canAddUser"] ?? null;
        $canRemoveUser = $input["canRemoveUser"] ?? null;
        $hasPinned = $input["hasPinned"] ?? null;

        $dbU = new DBAccess("users");
        $dbC = new DBAccess("calendars");

        if(!$dbU->findById($userId)){
            throw new Exception("User not found", 404);
        }
        if(!$dbC->findById($calId)){
            throw new Exception("Calendar not found", 404);
        }

        $db = new DBAccess("users_calendars");
        $all = $db->getAll();
        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["calId"] === $calId);
        if (!$exists) throw new Exception("Connection not found", 404);

        $bools = [
            "canDelete" => $canDelete,
            "canAddEvent" => $canAddEvent,
            "canRemoveEvent" => $canRemoveEvent,
            "canPostMsg" => $canPostMsg,
            "canAddUser" => $canAddUser,
            "canRemoveUser" => $canRemoveUser,
            "hasPinned" => $hasPinned,
            "canAll" => $canAll
        ];
        $boolsToChange = [];

        foreach ($bools as $item => $value) {
            if ($value !== null) {
                if (is_int($value)) {
                    if ($value === 0 || $value === 1) {
                        $boolsToChange[$item] = $value;
                    }
                } 
            }
        }

        $result = $db->patchData($exists["id"], $boolsToChange);
        return $result;
    }
}

