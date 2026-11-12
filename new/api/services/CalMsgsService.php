<?php

require_once __DIR__ . "/../repository/DBAccess.php";

class CalendarsMSGService
{
    /* ---- GET ---- */
    public static function getAll($input)
    {
        $senderId = $input["senderId"] ?? null;
        $calId = $input["calId"] ?? null;

        if (!isset($calId)) {
            throw new Exception("Missing attributes");
        }

        $db = new DBAccess("cal_msgs");
        $items = $db->getAll();

        $filtered = [];

        foreach ($items as $currItem) {

            if ($currItem["calId"] != $calId) {
                continue;
            }

            if ($senderId !== null && $currItem["senderId"] != $senderId) {
                continue;
            }

            $filtered[] = $currItem;
        }

        if (!$filtered) {
            throw new Exception("Messages not found");
        }

        return json_decode(json_encode($filtered), true);
    }

    /* --- POST ---- */
    public static function create($input)
    {

        $senderId = $input["senderId"] ?? null;
        $calId = $input["calId"] ?? null;
        $content = $input["content"] ?? null;

        if (!isset($senderId, $calId, $content)) {
            throw new Exception("Missing attributes");
        }

        $dbCals = new DBAccess("calendars");
        $itemsCals = $dbCals->getAll();

        $foundCalendar = false;
        // Does calendar exist
        foreach ($itemsCals as $currItem) {
            if ($currItem["id"] == $calId) {
                $foundCalendar = true;
            }
        }

        if ($foundCalendar == false) {
            throw new Exception("Invalid calendar");
        }

        //Kontrollera om det är tillåtet att posta
        $senderUC = UsersCalendarsService::getAllCalendarsByUserID($senderId);

        if($senderUC){
            $usersRelation = array_filter($senderUC, fn($x) => $x["calId"] == $calId);
            if($usersRelation["canPostMsg"] == 0){
                throw new Exception("Forbidden");
            }
        }

        // Create new MSG
        $date = date("Y-m-d");
        $time = date("H:i:s");

        $newMSG = [
            "id" => uniqid(),
            "calId" => $calId,
            "senderId" => $senderId,
            "date" => $date,
            "time" => $time,
            "content" => $content,
            "hasChanged" => false
        ];

        $dbCalMsg = new DBAccess("cal_msgs");

        // New item returned
        $result = $dbCalMsg->postData($newMSG);
        return $result;

    }



    /* --- PATCH ---- */
    public static function update($input)
    {

        $id = $input["id"] ?? null;
        $userId = $input["userId"] ?? null;
        $content = $input["content"] ?? null;

        if (!isset($id, $userId, $content)) {
            throw new Exception("Missing attributes");
        }

        $db = new DBAccess("cal_msgs");
        $items = $db->getAll();

        foreach ($items as $currItem) {
            if ($currItem["id"] == $id) {
                if($currItem["senderId"] != $userId){
                    throw new Exception("Forbidden");
                }
                $changes = ["content" => $content, "hasChanged" => true];

                // Updated item
                return $db->patchData($currItem["id"], $changes);
            }

        }

        throw new Exception("Message not found");

    }


    /* --- DELETE ---- */
    public static function delete($input) {

        $id = $input["id"] ?? null;
        $userId = $input["userId"] ?? null;

        if (!isset($id, $userId)) {
            throw new Exception("Missing attributes");
        }

        $db = new DBAccess("cal_msgs");
        $items = $db->getAll();

        foreach ($items as $currItem) {
            if ($currItem["id"] == $id) {
                if($currItem["senderId"] !== $userId){
                    throw new Exception("Forbidden");
                }
                // Returns deleted item
                return $db->deleteData($id);
            }
        }

        throw new Exception("Message not found");

    }

}