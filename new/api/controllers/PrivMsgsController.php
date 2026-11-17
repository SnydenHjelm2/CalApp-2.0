<?php
    require_once __DIR__ . "/../services/PrivMsgsService.php";
    require_once __DIR__ . "/response.php";
    class PrivMsgsController {
        public static function handle($method, $input) {
            if($method === "GET") {
                try {
                    $userId = $input["userId"] ?? null;
                    if($userId) {
                        return Response::send(PrivMsgService::getAllPrivateMsgForUser($input), 200);
                    } else {
                        return Response::send(PrivMsgService::getAllPrivateMsg(), 200);
                    }
                } catch (Exception $exc) {
                    //Kontrollera detta...
                    return Response::send(["error" => $exc->getMessage()], 404);
                }
            }
            if($method === "POST") {
                try {
                    $userId = $input["userId"] ?? null;
                    $receiverId = $input["receiverId"] ?? null;
                    $content = $input["content"] ?? null;

                    if(!$userId || !$receiverId || !$content) {
                        return Response::send(["error" => "Bad request"], 400);
                    } else {
                        return Response::send(PrivMsgService::createNewPrivMsg($input));
                    }
                } catch (Exception $exc) {
                    //Kontrollera
                    return Response::send(["error" => $exc->getMessage()], 404);
                }
            }
            if($method === "PATCH") {
                try {
                    $privMsgId = $input["privMsgId"];
                    $content = $input["content"];
                    if (!$privMsgId || !$content) {
                        return Response::send(["error" => "Bad request"], 400);
                    } else {
                        return Response::send(PrivMsgService::changePrivMsg($input));
                    }
                } catch (Exception $exc) {
                    // Kontrollera
                    return Response::send(["error" => $exc->getMessage()], 404);
                }

            }
            
            if($method === "DELETE") {
                try {
                    if(isset($input["privMsgId"])){
                        //Borde kanske lägga till om det är ens egna meddelande...
                        return Response::send(PrivMsgService::deletePrivMsg($input["privMsgId"]));
                    } else {
                        return Response::send(["error" => "Bad request"], 400);
                    }
                } catch (Exception $exc) {
                    // Kontrollera
                    return Response::send(["error" => $exc->getMessage()], 404);
                }

            }

        }
    }
?>