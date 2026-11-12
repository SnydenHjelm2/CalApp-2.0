<?php

require_once __DIR__ . "/response.php";
require_once __DIR__ . "/../services/BackupDBService.php";

class BackupDBController {
    public static function handle($method, $input) {
        if ($method !== "GET") Response::send(["error" => "Method not allowed"], 405);

        $entity = $input["entity"] ?? null;
        if (!$entity) Response::send(["error" => "Missing entity param"], 400);

        try {
            $result = BackupDBService::handle($entity);
            Response::send($result, 200);
        } catch (Exception $e) {
            Response::send(["error" => $e->getMessage()], 400);
        }
    }
}