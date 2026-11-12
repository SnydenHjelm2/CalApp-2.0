<?php

require_once __DIR__ . "/../repository/DBAccess.php";

class BackupDBService {
    public static $allEntities = ["users", "calendars", "events", "users_calendars", "users_events", "users_users", "cal_msgs", "priv_msgs"];

    public static function handle($entity) {
        switch ($entity) {
            case "all":
                foreach (BackupDBService::$allEntities as $ent) {
                    $backup = file_get_contents(__DIR__ . "/../repository/db-backup/" . $ent . ".json");
                    file_put_contents(__DIR__ . "/../repository/db/" . $ent . ".json", $backup);
                }
                return ["success" => "done"];

            default:
                $backup = file_get_contents(__DIR__ . "/../repository/db-backup/" . $entity . ".json");
                if ($backup === false) throw new Exception("Invalid entity");

                file_put_contents(__DIR__ . "/../repository/db/" . $entity . ".json", $backup);
                return ["success" => "done"];
        }
    }
}