<?php

require_once __DIR__ . "/../repository/DBAccess.php";

class UsersEventsService {
    public static function all() {
        $db = new DBAccess("users_events");
        return $db->getAll();
    }

    public static function params($userId, $eventId) {
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
        }
    }

    public static function POST($input) {
        $userId = $input["userId"];
        $eventId = $input["eventId"];
        $isCreator = $input["isCreator"];

        $db = new DBAccess("users_events");
        $all = $db->getAll();

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
        $db->postData($new);
        return $new;
    }

    public static function PATCH($input) {
        $userId = $input["userId"];
        $eventId = $input["eventId"];
        $isInterested = $input["isInterested"] ?? null;
        $isComing = $input["isComing"] ?? null;
        $isNotComing = $input["isNotComing"] ?? null;

        $db = new DBAccess("users_events");
        $all = $db->getAll();

        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
        if (!$exists) throw new Exception("Connection not found");

        $changes = [];

        if (is_int($isInterested)) {
            if ($isInterested > 1 || $isInterested < 0) throw new Exception("Invalid type");
            if ($isInterested === $exists["isInterested"]) throw new Exception("Change already in place");

            $changes["isInterested"] = $isInterested;
            return $db->patchData($exists["id"], $changes);
        }

        if (is_int($isComing)) {
            if ($isComing > 1 || $isComing < 0) throw new Exception("Invalid type");
            if ($isComing === $exists["isComing"]) throw new Exception("Change already in place");

            $changes["isComing"] = $isComing;
            if ($isComing === 1) $changes["isNotComing"] = 0;
            return $db->patchData($exists["id"], $changes);
        }

        if (is_int($isNotComing)) {
            if ($isNotComing > 1 || $isNotComing < 0) throw new Exception("Invalid type");
            if ($isNotComing === $exists["isNotComing"]) throw new Exception("Change already in place");

            $changes["isNotComing"] = $isNotComing;
            if ($isNotComing === 1) $changes["isComing"] = 0;
            return $db->patchData($exists["id"], $changes);
        }
    }

    public static function DELETE($input) {
        $userId = $input["userId"];
        $eventId = $input["eventId"];

        $db = new DBAccess("users_events");
        $all = $db->getAll();

        $exists = array_find($all, fn($x) => $x["userId"] === $userId && $x["eventId"] === $eventId);
        if (!$exists) throw new Exception("Connection not found");

        $db->deleteData($exists["id"]);
        return ["success" => "Connection deleted"];
    }
}