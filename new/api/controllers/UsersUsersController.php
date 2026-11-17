<?php 
    require_once __DIR__ . "/../services/UsersUsersService.php";
    require_once __DIR__ . "/response.php";
    class UsersUsersController {
        public static function handle($method, $input){
            if($method == "GET") {
                try {
                    $userId = $input["userId"] ?? null;
                    $userId1 = $input["userId1"] ?? null;
                    $userId2 = $input["userId2"] ?? null;
                    
                    if(empty($input)) {
                        return Response::send(UsersUsersService::getAll(), 200);
                    }
                    //if($userId && !$userId1 && !$userId2) ??
                    if($userId) {
                        return Response::send(UsersUsersService::getAllRelationsOfUser($userId), 200);
                    } else if ($userId1 && $userId2) {
                       return Response::send(UsersUsersService::getRelationOfUsers($userId1, $userId2), 200);
                    } else if (($userId1 && !$userId2) || ($userId2 && !$userId1)){
                        return Response::send(["error" => "Missing attributes"], 400);
                    }
                } catch (Exception $exc) {
                    $err = $exc->getMessage();
                    return Response::send(["error" => $err], 404);
                }

            }
            if($method == "POST") {
                try{
                    $actor = $input["actor"] ?? null;
                    $userId = $input["userId"] ?? null;

                    $options = [];
                    if(array_key_exists("blocks", $input)) {
                        $options["blocks"] = $input["blocks"] ? 1 : 0;
                    }
                    if (array_key_exists("friends", $input)){
                        $options["friends"] = $input["friends"] ? 1 : 0;
                    }
                    
                    if(!$actor || !$userId || !$options) {
                        return Response::send(["error" => "Missing attributes"], 400);
                    } else if ($actor == $userId ){
                        return Response::send(["error" => "Cannot relate to self"], 400);
                    } else {
                        return Response::send(UsersUsersService::post($actor, $userId, $options), 200);
                    }

                } catch(Exception $exc) {
                    return Response::send(["error" => $exc->getMessage()], 400);
                }

            }

            if($method == "PATCH") {
                try{
                    $actor = $input["actor"] ?? null; //Den som blockar/manipulerar vänrelation
                    $userId = $input["userId"] ?? null; //Den andre


                    $options = [];
                    if(array_key_exists("blocks", $input)) {
                        $options["blocks"] = $input["blocks"] ? 1 : 0;
                    }
                    if (array_key_exists("friends", $input)){
                        $options["friends"] = $input["friends"] ? 1 : 0;
                    }
                    
                    if(!$actor || !$userId || !$options) {
                        return Response::send(["error" => "Missing attributes"], 400);
                    }
                    if ($actor == $userId ){
                        return Response::send(["error" => "Cannot relate to self"], 400);
                    } 
          
                    return Response::send(UsersUsersService::patch($actor, $userId, $options), 200);

                } catch(Exception $exc) {
                    return Response::send(["error" => $exc->getMessage()], 400);
                }
            }
            if($method == "DELETE") {
                //Här deletar vi bara vi har 2 id:n, säkert dålig idé menmen
            }
        }
    }

?>