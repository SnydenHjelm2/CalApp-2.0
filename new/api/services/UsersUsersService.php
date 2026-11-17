<?php

require_once __DIR__ . "/../repository/DBAccess.php";

class UsersUsersService {
    public static function getAll() {
        $db = new DBAccess("users_users");
        $items = $db->getAll();
        return $items;
    }

    public static function getAllRelationsOfUser($userId) {
        //kanske ska kolla om user blocks??
        $dbU = new DBAccess("users");
        if ($dbU->findById($userId) === null){
            throw new Exception("Invalid user-ID");
        }
        $db = new DBAccess("users_users");
        $items = $db->getAll();
        $result = array_values(array_filter($items, fn($x) => $x["user1Id"] == $userId || $x["user2Id"] == $userId));
        if(empty($result)) {
            throw new Exception("No relations found");
        }
        else {
            return $result;
        }
    }
    public static function getRelationOfUsers($userId1, $userId2) {
        $dbU = new DBAccess("users");
        if ($dbU->findById($userId1) === null || $dbU->findById($userId2) === null){
            throw new Exception("Invalid user-ID");
        }

        $items = self::getAll();
        $result = array_filter($items, fn($x) => ($x["user1Id"] == $userId1 && $x["user2Id"] == $userId2) || ($x["user2Id"] == $userId1 && $x["user1Id"] == $userId2));
        if (empty($result)) {
            throw new Exception("No relation found");
        } else {
            return $result;
        }
       
    }

    public static function post($actor, $target, $options) {
        $dbU = new DBAccess("users");
        if ($dbU->findById($actor) === null || $dbU->findById($target) === null){
            throw new Exception("Invalid user-ID");
        }
        $items = self::getAll();
        $existing = array_find($items, fn($x) => ($x["user1Id"] == $actor && $x["user2Id"] == $target) || ($x["user2Id"] == $actor && $x["user1Id"] == $target));
        if ($existing) {
            /*
            Man kan tänkas blockera någon utan att veta om man är blockerad 
            dvs. att relation i users_users finns och då skickar vi troligtvis bara in userId1 och userId2
            Men eftersom vi inte vet vilket id som ligger vart så kontrollerar vi om user1Id är samma som $userId1
            Om det är det så lägger vi till "1blocks2" annars "2blocks1";
            */
            return self::patch($actor, $target, $options);

        } else {
            $db = new DBAccess("users_users");
            
            if(array_key_exists("blocks", $options)) {
                $newPost = [
                    "id" => uniqid(),
                    "user1Id" => $actor,
                    "user2Id" => $target,
                    "1blocks2" => $options["blocks"],
                    "2blocks1" => 0,
                    "friends" => 0,

                ];

                return $db->postData($newPost);
            } else {
                $newPost = [
                    "id" => uniqid(),
                    "user1Id" => $actor,
                    "user2Id" => $target,
                    "1blocks2" => $options["blocks"] ?? 0,
                    "2blocks1" => 0,
                    "friends" => $options["friends"] ?? 0,

                ];
                return $db->postData($newPost);
            }
        }
    }

    public static function patch($actor, $target, $options) {
        $dbU = new DBAccess("users");
        if ($dbU->findById($actor) === null || $dbU->findById($target) === null){
            throw new Exception("Invalid user-ID");
        }
        //block or friends;
        $items = self::getAll();
        $existing = array_find($items, fn($x) => ($x["user1Id"] == $actor && $x["user2Id"] == $target) || ($x["user2Id"] == $actor && $x["user1Id"] == $target));
        if ($existing) {
            $keysToChange = [];
            if(array_key_exists("blocks", $options)){
                $field = $existing["user1Id"] == $actor ? "1blocks2" : "2blocks1";
                $change = $options["blocks"];
                $keysToChange[$field] = $change;
            }
            if(array_key_exists("friends", $options)){
                $keysToChange["friends"] = $options["friends"];
            }
            $db = new DBAccess("users_users");
            $result = $db->patchData($existing["id"], $keysToChange);
            return $result;

        }
        else {
            throw new Exception("Could not find relation");
        }
        
    }

    public static function delete($input) {

    }
}

?>