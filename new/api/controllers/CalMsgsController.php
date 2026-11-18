
<?php

require_once __DIR__ . "/../services/CalMsgService.php";
require_once __DIR__ . "/response.php";
class CalMsgsController {


    /* -- HANDLER -- */
    public static function handle($method, $input) {
        error_log("method=" . $method . " input=" . json_encode($input) . " GET=" . json_encode($_GET));

        if ($method == "GET") {

            if(!is_array($input) || !isset($input["calId"], $input["actor"])) {
                return Response::send(["error" => "Missing Attributes"], 400);
            }

            try {
                $result = CalMsgService::getAll($input);
                return Response::send($result, 200);

            } catch (Exception $exc) {
                return Response::send($exc->getMessage(), 404);
            }
        }


        if ($method == "POST") {

            if (!is_array($input) || !isset($input["senderId"], $input["calId"], $input["content"])) {
                return Response::send("Missing Attributes", 400);
            }

            try {
                 
                $result = CalMsgService::create($input);
                return Response::send($result, 201);

            } catch (Exception $exc) {
                $err = $exc->getMessage();
                if ($err == "Forbidden") {

                    return Response::send(["error" => $err], 409);
                }
                else {
                    return Response::send(["error" => $err], 404);
                }


            }



        }

        if ($method == "PATCH") {
            
            if(!is_array($input) || !isset($input["id"], $input["userId"], $input["content"])) {
                return Response::send(["error" => "Missing Attributes"], 400);
            }
            try {
                
                $result = CalMsgService::update($input);
                return Response::send($result, 200);

            } catch (Exception $exc) {
                $err = $exc->getMessage();

                if($err == "Forbidden"){
                    return Response::send(["error" => $err], 409);
                }
                return Response::send(["error" => $err], 404);
                
            }

        }

        if ($method == "DELETE") {
            
            if(!is_array($input) || !isset($input["id"], $input["userId"])){
                return Response::send(["error" => "Missing Attributes"], 400);
            }

            try {
                    
                $result = CalMsgService::delete($input);
                return Response::send($result, 200);

            } catch (Exception $exc) {
                $err = $exc->getMessage();
                if($err == "Forbidden"){
                    return Response::send(["error" => $err], 409);
                }
                return Response::send(["error" => $err], 404);

            }
        }

    }

}