<?php

require_once __DIR__ . "/../services/EventsService.php";
require_once __DIR__ . "/response.php";



class EventsController {
    public static function handle($method, $input) {
        if ($method === "GET") {
            try {
                $eventId = $input["eventId"] ?? null;
                $calId = $input["calId"] ?? null;

                if ($eventId && !$calId) {
                    Response::send(EventsService::getEventById($eventId), 200);
                    return;
                } else if ($calId && !$eventId) {
                    Response::send(EventsService::getEventsCal($calId), 200);
                    return;
                } else if (!$eventId || !$calId) {
                    Response::send(EventsService::getAllEvents(), 200);
                    return;
                } else {
                    Response::send(["error" => "Bad request"], 400);
                    return;
                }
            } catch (Exception $e) {
                $msg = $e->getMessage();
                if ($msg === "Event not found" || $msg === "No events found") {
                    Response::send(["error" => "No event(s) found"], 404);
                } else {
                    Response::send(["error" => $msg], 400);
                }
                return;
            }
        } else if ($method === "POST") {
            try {
                $date =  $input["date"] ?? null;
                $name = $input["name"] ?? null;
                $desc = $input["description"] ?? null;
                $time = $input["time"] ?? null;
                $location = $input["location"] ?? null;
                $tags = $input["tags"] ?? null;
                $calId = $input["calId"] ?? null;

                $userId = $input["userId"] ?? null; //För check om användaren har behörighet

                if (!$date || !$name || !$desc || !$time || !$location || !$calId || !$userId) throw new Exception("Missing attributes");
                Response::send(EventsService::createNewEvent($input), 201);
                return;
            } catch (Exception $e) {
                $msg = $e->getMessage();
                if ($msg === "Missing attributes") {
                    Response::send(["error" => $e->getMessage()], 400);
                    return;
                } else if ($msg === "Cal not found") {
                    Response::send(["error" => $e->getMessage()], 404);
                    return;
                } else if ($msg === "Unauthorized") {
                    Response::send(["error" => $e->getMessage()], 403);
                    return;
                }
            }
        } else if ($method === "PATCH") {
            try {
                $eventId = $input["eventId"] ?? null;
                $calId = $input["calId"] ?? null;
                $name = $input["name"] ?? null;
                $date = $input["date"] ?? null;
                $time = $input["time"] ?? null;
                $desc = $input["description"] ?? null;
                $location = $input["location"] ?? null;
                $tags = $input["tags"] ?? null;
                $userId = $input["userId"] ?? null; //För check av behörighet
        
                if (!$eventId || !$calId || !$userId) {
                    throw new Exception("Missing attributes");
                }

                if (!$name && !$date && !$time && !$desc && !$location && !$tags) {
                    throw new Exception("No patchable attributes");
                }
                Response::send(EventsService::patchEvent($input), 200);
                return;
            } catch (Exception $e) {
                $msg = $e->getMessage();
                if ($msg === "Missing attributes") {
                    Response::send(["error" => $e->getMessage()], 400);
                    return;
                } else if ($msg === "Unautorized") {
                    Response::send(["error" => $e->getMessage()], 403);
                    return;
                } else if ($msg === "Not found") {
                    Response::send(["error" => $e->getMessage()], 404);
                    return;
                } else {
                    Response::send(["error" => $msg], 400);
                }
            }
        } else if ($method === "DELETE") {
            try {
                $calId = $input["calId"] ?? null;
                $eventId = $input["eventId"] ?? null;
                $userId = $input["userId"] ?? null; //För check om behörighet

                if (!$calId || !$eventId || !$userId) {
                    throw new Exception("Missing attributes");
                }
                Response::send(EventsService::deleteEvent($input), 200);
                return;
            } catch (Exception $e) {
                $msg = $e->getMessage();
                if ($msg === "Missing attributes") {
                    Response::send(["error" => $e->getMessage()], 400);
                    return;
                } else if ($msg === "Unautorized") {
                    Response::send(["error" => $e->getMessage()], 403);
                    return;
                } else if ($msg === "Not found") {
                    Response::send(["error" => $e->getMessage()], 404);
                    return;
                }
            }
        }
    }
}

?>