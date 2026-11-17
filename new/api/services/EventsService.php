<?php

require_once __DIR__ . "/../repository/DBAccess.php";
require_once __DIR__ . "/UsersCalendarsService.php";
require_once __DIR__ . "/UsersEventsService.php";

class EventsService {
    //GET-metoder
    public static function getAllEvents() {
        $db = new DBAccess("events");
        return $db->getAll();
    }

    public static function getEventById($id) {
        $db = new DBAccess("events");
        $event = $db->findById($id);

        if (!$event) {
            throw new Exception("Event not found");
        } else {
            return $event;
        }
    }

    public static function getEventsCal($cal) {
        $db = new DBAccess("events");
        $calsDb = new DBAccess("calendars");
        if (!$calsDb->findById($cal)) throw new Exception("Calendar not found");

        $events = $db->getAll();
        $eventsByCal = array_values(array_filter($events, fn($x) => $x["calId"] === $cal));
        return $eventsByCal;
    }

    //POST-metoder
    public static function createNewEvent($input) {
        // $userId = $input["userId"] ?? null; för kontroll om behörighet
        $date =  $input["date"];
        $name = $input["name"];
        $desc = $input["description"];
        $time = $input["time"];
        $location = $input["location"];
        $tags = $input["tags"] ?? null;
        $calId = $input["calId"];
        $userId = $input["userId"]; //För check om behörighet

        $cals = new DBAccess("calendars");
        $cal = $cals->findById($calId);
        $users = new DBAccess("users");
        $user = $users->findById($userId);
        if (!$cal) throw new Exception("Cal not found");
        if (!$user) throw new Exception("User not found");

        $connections = UsersCalendarsService::getAllRelationsByUser($user["id"]);
        $connection = array_find($connections, fn($x) => $x["calId"] === $cal["id"]);

        if (!$connection) throw new Exception("User not in cal");

        if ($connection["canAddEvent"] === 0 && $connection["canAll"] === 0) {
            throw new Exception("Unauthorized");
        }

        if ($tags === null) $tags = "";

        //userId ska även senare kollas om den är admin i den specificerade calId
        //Kasta exception om inte
        $newEvent = [
            "id" => uniqid(),
            "name" => $name,
            "description" => $desc,
            "date" => $date,
            "time" => $time,
            "location" => $location,
            "tags" => $tags,
            "calId" => $calId
        ];

        $eventsDb = new DBAccess("events");
        return $eventsDb->postData($newEvent);
    }

    //PATCH-metoder
    public static function patchEvent($input) {
        $eventId = $input["eventId"];
        $calId = $input["calId"];
        $name = $input["name"] ?? null;
        $date = $input["date"] ?? null;
        $time = $input["time"] ?? null;
        $desc = $input["description"] ?? null;
        $location = $input["location"] ?? null;
        $tags = $input["tags"] ?? null;
        $userId = $input["userId"]; //För check om behörighet

        $events = new DBAccess("events");
        $cals = new DBAccess("calendars");
        $users = new DBAccess("users");
        $event = $events->findById($eventId);
        $cal = $cals->findById($calId);
        $user = $users->findById($userId);

        if (!$event || !$cal || !$user) throw new Exception("Not found");

        $connections = UsersCalendarsService::getAllRelationsByUser($user["id"]);
        $connection = array_find($connections, fn($x) => $x["calId"] === $cal["id"]);

        if (!$connection) throw new Exception("User not in cal");

        if ($connection["canAddEvent"] === 0 && $connection["canAll"] === 0) {
            throw new Exception("Unauthorized");
        }

        $patchAttributes = [
            "name" => $name,
            "date" => $date,
            "description" => $desc,
            "time" => $time,
            "location" => $location,
            "tags" => $tags
        ];
        $patchBody = [];

        foreach($patchAttributes as $att => $value) {
            if ($value !== null) {
                $patchBody[$att] = $value;
            }
        }

        return $events->patchData($eventId, $patchBody);
    }

    //DELETE-metoder
    public static function deleteEvent($input) {
        $calId = $input["calId"];
        $eventId = $input["eventId"];
        $userId = $input["userId"]; //För check om behörighet
        
        $events = new DBAccess("events");
        $cals = new DBAccess("calendars");
        $users = new DBAccess("users");
        $event = $events->findById($eventId);
        $cal = $cals->findById($calId);
        $user = $users->findById($userId);

        if (!$event || !$cal || !$user) {
            throw new Exception("Not found");
        }

        $connections = UsersCalendarsService::getAllRelationsByUser($user["id"]);
        $connection = array_find($connections, fn($x) => $x["calId"] === $cal["id"]);

        if (!$connection) throw new Exception("User not in cal");

        if ($connection["canRemoveEvent"] === 0 && $connection["canAll"] === 0) {
            throw new Exception("Unauthorized");
        }

        $events->deleteData($eventId);
        return ["success" => "Event deleted successfully"];
    } 
 }

?>