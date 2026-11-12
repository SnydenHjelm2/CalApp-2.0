
<?php

require_once __DIR__ . "/../services/CalendarsMSGService.php";
class CalendarsMSGController {


    /* -- HANDLER -- */
    public static function handle($method, $input) {

        if ($method == "GET") {

            if(!is_array($input) || !isset($input["calId"], $input["senderId"])) {
                return Response::send("Missing Attributes", 400);
            }

            try {
                $result = CalendarsMSGService::getAll($input);
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
                 
                $result = CalendarsMSGService::create($input);
                return Response::send($result, 201);

            } catch (Exception $exc) {    
                if ($exc->getMessage() == "Forbidden") {

                    return Response::send($exc->getMessage(), 409);
                }
                else {
                    return Response::send($exc->getMessage(), 404);
                }


            }



        }

        if ($method == "PATCH") {
            
            if(!is_array($input) || isset($input["id"], $input["userId"], $input["content"])) {
                return Response::send("Missing Attributes", 400);
            }
            try {
                
                $result = CalendarsMSGService::update($input);
                return Response::send($result, 200);

            } catch (Exception $exc) {
                $err = $exc->getMessage();

                if($err == "Forbidden"){
                    return Response::send($err, 409);
                }
                return Response::send($exc, 404);
                
            }

        }

        if ($method == "DELETE") {
            
            if(!is_array($input) || !isset($id, $userId)){
                return Response::send("Missing Attributes", 400);
            }

            try {
                    
                $result = CalendarsMSGService::delete($input);
                return Response::send($result, 200);

            } catch (Exception $exc) {
                $err = $exc->getMessage();
                if($err == "Forbidden"){
                    return Response::send($err, 409);
                }
                return Response::send($exc, 404);

            }
        }

    }

}