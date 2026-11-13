<?php

require_once __DIR__ . "/../services/UsersCalendarsService.php";
require_once __DIR__ . "/response.php";

class UsersCalendarsController {

    public static function handle($method, $input): void {

        if ($method === "GET") {
            try {
                $id = $input["id"] ?? null;
                $userId = $input["userId"] ?? null;
                $calId = $input["calId"] ?? null;

                if ($id) {
                    $result = UsersCalendarsService::getRelationById($id);
                } elseif ($userId) {
                    $result = UsersCalendarsService::getAllRelationsByUser($userId);
                } elseif ($calId) {
                    $result = UsersCalendarsService::getAllRelationsByCalId($calId);
                } else {
                    $result = UsersCalendarsService::getAll();
                }

                Response::send($result, 200);
                return;

            } catch (Exception $exc) {
                $code = $exc->getCode() ?:400;
                Response::send(["error" => $exc->getMessage()],$code);
                return;
            }
        }


        if ($method === "POST") {
            try {
                $userId  = $input["userId"] ?? null;
                $calId = $input["calId"] ?? null;
                $isCreator = $input["isCreator"] ?? null;
                $calAll = $input["canAll"] ?? null;

                if (!$userId || !$calId || $calAll === null || $isCreator === null) {
                    throw new Exception("Missing attributes");
                }

                $result = UsersCalendarsService::addUserToCalendar($input);
                Response::send($result, 201);
                return;

            } catch (Exception $exc) {
                $code = $exc->getCode() ?:400;
                Response::send(["error" => $exc->getMessage()],$code);
                return;
            }
        }

        if ($method === "PATCH") {
            try {
                $userId  = $input["userId"] ?? null;
                $calId = $input["calId"] ?? null;
                $canAll = $input["canAll"] ?? null;
                $canDelete = $input["canDelete"] ?? null;
                $canAddEvent = $input["canAddEvent"] ?? null;
                $canRemoveEvent = $input["canRemoveEvent"] ?? null;
                $canPostMsg = $input["canPostMsg"] ?? null;
                $canAddUser = $input["canAddUser"] ?? null;
                $canRemoveUser = $input["canRemoveUser"] ?? null;
                $hasPinned = $input["hasPinned"] ?? null;
                
                if (!$userId || !$calId) {
                    throw new Exception("Missing attributes");
                }

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

                $something = false;
                foreach ($bools as $item) {
                    if ($item !== null) {
                        $something = true;
                        break;
                    }
                }

                if (!$something) throw new Exception("No patchable attributes");

                $result = UsersCalendarsService::makeUserCalAdmin($input);
                Response::send($result, 200);
                return;

            } catch (Exception $exc) {
                $code = $exc->getCode() ?:400;
                Response::send(["error" => $exc->getMessage()],$code);
                return;
            }
        }

        if ($method === "DELETE") {
            try {
                $result = UsersCalendarsService::removeUserFromCal($input);
                Response::send($result, 200);
                return;

            } catch (Exception $exc) {
                $code = $exc->getCode() ?:400;
                Response::send(["error" => $exc->getMessage()],$code);
                return;
            }
        }
    }
}
