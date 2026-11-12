<?php

require_once __DIR__ . "/../services/CalendarsService.php";
require_once __DIR__ . "/response.php";

class CalendarsController{

    public static function handle($method, $input){

        if($method == "GET"){
            try{
                // OM det inte finns några parameter, hämta alla
                if(empty($input)){
                    return Response::send(CalendarsService::calendarsGetAll(), 200);
                } else {
                    // Hämta en specifik calendar med id parameter
                    if(isset($input["id"])){
                        return Response::send(CalendarsService::calendarsGetById($input), 200);
    
                    } else {
                        return Response::send(["error" => "Value missing"], 400);
                    }
                } 
                // Denna tar emot flera catchs beroende på id eller alla
            } catch(Exception $error){
                return Response::sendResponse(["error" => $error->getMessage()], 404);
            } 
        }

        if($method == "POST"){
            try{
                if(
                    !isset($input["creatorId"]) || //Döpa om?
                    !isset($input["name"]) || 
                    !isset($input["description"]) || 
                    !isset($input["isPublic"]) // behövs?
                ){
                    return Response::send(["error" => "Attributes missing"], 400);
                } else {
                    return Response::send(CalendarsService::calendarsPost($input), 201);
                }
            } catch(Invalid $error){ // invalid?
                return Response::send(["error" => $error->getMessage()], 400);
            } catch(AlreadyInGroup $error){ // AlreadyInGroup?
                return Response::send(["error" => $error->getMessage()], 409);
            }

        }

        if($method == "PATCH"){
            try{
                if(!isset($input["calId"]) || !isset($input["userId"])){
                    return Response::send(["error" => "Id missing"], 400);
                } else {
                    return Response::send(CalendarsService::calendarsPatch($input), 200);
                }

            } catch(Exception $error){
                return Response::send(["error" => $error->getMessage()], 400);
            }

        }

        if($method == "DELETE"){
            try{
                if(!isset($input["id"])){
                    return Response::send(["error" => "Missing attributes"], 400);
                } else {
                    return Response::send(CalendarsService::calendarsDelete($input), 200);
                }

            } catch(Exception $error){
                return Response::send(["error" => $error->getMessage()], 404);
            }



        }

    }

}



?>