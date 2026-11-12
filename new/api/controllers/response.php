<?php 

class Response {
    public static function send($data, $status) {
        header("Content-Type: application/json");
        http_response_code($status);
        echo json_encode($data);
        exit();
    }
}