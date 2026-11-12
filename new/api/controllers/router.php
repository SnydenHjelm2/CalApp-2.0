<?php

// Middleware
require_once __DIR__ . "/../middleware/Middleware.php";

// Controllers
require_once __DIR__ . "/UsersEventsController.php";
require_once __DIR__ . "/BackupDBController.php";

function Router($requestUrl = null){
    CorsMiddleware::handle();
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }
    
    if ($requestUrl === null) {
        $requestUrl = $_SERVER["REQUEST_URI"] ?? "";
    }

    $urlPath = parse_url($requestUrl, PHP_URL_PATH);
    $path = ltrim($urlPath, "/");

    $method = $_SERVER["REQUEST_METHOD"];
    
    if ($method == "GET"){
        $input = $_GET ?? [];
    } else {
        JsonMiddleware::handle();
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
    }

    switch ($path) {
        //återställa DB
        case "backup":
            BackupDBController::handle($method, $input);
            break;

        case "cal_msgs":
            
            break;

        case "calendars":

            break;

        case "events":

            break;

        case "priv_msgs":

            break;

        case "users":

            break;

        case "users_calendars":

            break;

        case "users_events":
            UsersEventsController::handle($method, $input);
            break;

        case "users_users":

            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Bad Request"]);
            exit();
    }
}
