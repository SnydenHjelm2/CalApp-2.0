<?php

require_once __DIR__ . "/response.php";
require_once __DIR__ . "/../services/UsersEventsService.php";

class UsersEventsService {
    public static function handle($method, $input) {
        try {
            switch ($method) {
                case "GET":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;

                    if ($userId || $eventId) {
                        $result = UsersEventsService::params($userId, $eventId);
                        Response::send($result, 200);
                    } else {
                        $result = UsersEventsService::all();
                    }

                case "POST":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;
                    $isCreator = $input["isCreator"] ?? null;

                    if (!$userId || !$eventId || $isCreator === null) {
                        throw new Exception("Missing attributes");
                    }

                    $result = UsersEventsService::POST($input);
                    Response::send($result, 201);

                case "PATCH":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;

                    if (!$userId || !$eventId) {
                        throw new Exception("Missing attributes");
                    }

                    $result = UsersEventsService::PATCH($input);
            }
        } catch (Exception $e) {
            $msg = $e->getMessage();
            $status = null;

            switch ($msg) {
                case "Missing attributes":
                    $status = 400;
                    break;

                default:
                    $status = 400;
                    break;
            }

            Response::send(["error" => $msg], $status);
        }
    }
}