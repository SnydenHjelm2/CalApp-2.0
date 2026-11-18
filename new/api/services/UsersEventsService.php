<?php

require_once __DIR__ . "/../repository/DBAccess.php";
require_once __DIR__ . "/CalendarsService.php";
require_once __DIR__ . "/UsersCalendarsService.php";
require_once __DIR__ . "/EventsService.php";

class UsersEventsService {
    public static function all() {
        $db = new DBAccess("users_events");
        return $db->getAll();
    }

    public static function params($userId, $eventId, $id) {
        $db = new DBAccess("users_events");
        $all = $db->getAll();

        if ($userId && $eventId) {
            $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
            if (!$exists) throw new Exception("Connection not found");
            return $exists;
        } else if ($userId) {
            $connections = array_values(array_filter($all, fn($x) => $x["userId"] === $userId));
            return $connections;
        } else if ($eventId) {
            $connections = array_values(array_filter($all, fn($x) => $x["eventId"] === $eventId));
            return $connections;
        } else if ($id) {
            $conn = $db->findById($id);
            if (!$conn) throw new Exception("Connection not found");
            return $conn;
        }
    }

    public static function POST($input) {
        $userId = $input["userId"];
        $eventId = $input["eventId"];
        $isCreator = $input["isCreator"];

        $db = new DBAccess("users_events");
        $all = $db->getAll();

        $calDb = new DBAccess("calendars");
        $eventsDb = new DBAccess("events");

        $event = $eventsDb->findById($eventId);
        if (!$event) throw new Exception("Event not found");

        $cal = $calDb->findById($event["calId"]);

        if (!$cal["isPublic"]) {
            try {
                $usersCalConns = UsersCalendarsService::getAllRelationsByCalId($cal["id"]);
                $conn = array_find($usersCalConns, fn($x) => $x["userId"] === $userId);
                if (!$conn) throw new Exception("User not in calendar : calendar private");
            } catch (Exception $e) {
                throw new Exception($e->getMessage());
            }
        } 

        if (!is_int($isCreator)) throw new Exception("Invalid type");

        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
        if ($exists) throw new Exception("Connection already exists");

        $new = [
            "userId" => $userId,
            "eventId" => $eventId,
            "isCreator" => $isCreator,
            "isInterested" => 0,
            "isComing" => 0,
            "isNotComing" => 0,
            "id" => uniqid()
        ];

        if ($isCreator) $new["isComing"] = 1;
        return $db->postData($new);
    }

    public static function PATCH($input) {
        $userId = $input["userId"];
        $eventId = $input["eventId"];
        $isInterested = $input["isInterested"] ?? null;
        $isComing = $input["isComing"] ?? null;
        $isNotComing = $input["isNotComing"] ?? null;

        $db = new DBAccess("users_events");
        $all = $db->getAll();

        $eventsDb = new DBAccess("events");
        if (!$eventsDb->findById($eventId)) throw new Exception("Event not found");

        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
        if (!$exists) throw new Exception("Connection not found");

        $changes = [];

        if (is_int($isInterested)) {
            if ($isInterested > 1 || $isInterested < 0) throw new Exception("Invalid value");

            $changes["isInterested"] = $isInterested;
        }

        if (is_int($isComing)) {
            if ($isComing > 1 || $isComing < 0) throw new Exception("Invalid value");

            $changes["isComing"] = $isComing;
            if ($isComing === 1) $changes["isNotComing"] = 0;
        }

        if (is_int($isNotComing)) {
            if ($isNotComing > 1 || $isNotComing < 0) throw new Exception("Invalid value");

            $changes["isNotComing"] = $isNotComing;
            if ($isNotComing === 1) $changes["isComing"] = 0;
        }

        if (count($changes) === 0) throw new Exception("No patchable attributes");

        return $db->patchData($exists["id"], $changes);
    }

    public static function DELETE($input) {
        $userId = $input["userId"] ?? null;
        $eventId = $input["eventId"] ?? null;
        $id = $input["id"] ?? null;

        $db = new DBAccess("users_events");
        $all = $db->getAll();

        if ($id) {
            $conn = $db->findById($id);
            if (!$conn) throw new Exception("Connection not found");

            $db->deleteData($conn["id"]);
            return ["success" => "Connection deleted"];
        }

        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
        if (!$exists) throw new Exception("Connection not found");

        $db->deleteData($exists["id"]);
        return ["success" => "Connection deleted"];
    }
}