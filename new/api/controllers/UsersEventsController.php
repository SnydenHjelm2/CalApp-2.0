<?php

require_once __DIR__ . "/response.php";
require_once __DIR__ . "/../services/UsersEventsService.php";

class UsersEventsController {
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
                        Response::send($result, 200);
                    }
                    break;

                case "POST":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;
                    $isCreator = $input["isCreator"] ?? null;

                    if (!$userId || !$eventId || $isCreator === null) {
                        throw new Exception("Missing attributes");
                    }

                    $result = UsersEventsService::POST($input);
                    Response::send($result, 201);
                    break;

                case "PATCH":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;
                    $isInterested = $input["isInterested"] ?? null;
                    $isComing = $input["isComing"] ?? null;
                    $isNotComing = $input["isNotComing"] ?? null;

                    if (!$userId || !$eventId) {
                        throw new Exception("Missing attributes");
                    }

                    if ($isInterested === null && $isComing === null && $isNotComing === null) {
                        throw new Exception("No patchable attributes");
                    }

                    $result = UsersEventsService::PATCH($input);
                    Response::send($result, 200);
                    break;

                case "DELETE":
                    $userId = $input["userId"] ?? null;
                    $eventId = $input["eventId"] ?? null;

                    if (!$userId || !$eventId) {
                        throw new Exception("Missing attributes");
                    }

                    $result = UsersEventsService::DELETE($input);
                    Response::send($result, 200);
                    break;

                default:
                    throw new Exception("Method not allowed");
            }
        } catch (Exception $e) {
            $msg = $e->getMessage();
            $status = null;

            switch ($msg) {
                case "Missing attributes":
                    $status = 400;
                    break;

                case "Connection not found":
                    $status = 404;
                    break;

                case "Method not allowed":
                    $status = 405;
                    break;

                case "Connection already exists":
                    $status = 409;
                    break;

                default:
                    $status = 400;
                    break;
            }

            Response::send(["error" => $msg], $status);
        }
    }
}