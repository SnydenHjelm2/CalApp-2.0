<?php
    require_once __DIR__ . "/../repository/DBAccess.php";

    class PrivMsgService {
        public static function getAllPrivateMsg() {
            $db = new DBAccess("priv_msgs");
            $result = $db->getAll();
            return $result;
        }

        public static function getAllPrivateMsgForUser($input) {
            $db = self::getAllPrivateMsg();
            $result = array_values(array_filter($db, fn($x) => $x["senderId"] == $input["userId"] || $x["receiverId"] ==$input["userId"]));
            if (empty($result)) {
                throw new Exception("No messages found");
            } else {
                return $result;
            }
        }


        public static function createNewPrivMsg($input) {
            $db = new DBAccess("users");
            $receiverExisting = $db->findById($input["receiverId"]);
            if($receiverExisting === null) {
                throw new Exception("The receiver doesn't exist");
            } else {
                $db = new DBAccess("priv_msgs");
                $newMsg = [
                    "id" => uniqid(),
                    "senderId" => $input["userId"],
                    "receiverId" => $input["receiverId"],
                    "date" => date("Y-m-d"),
                    "time" => date("H:i:s"),
                    "content" => $input["content"],
                    "hasChange" => false

                ];
                $result = $db ->postData($newMsg);
                return $result;
            }
        }
        public static function changePrivMsg($input) {
            $db = new DBAccess("priv_msgs");
            $result = $db->findById($input["privMsgId"]);
            if($result === null) {
                throw new Exception("The message couldn't be found");
            } else {
                $id = $input["privMsgId"];
                $data = [
                    "content" => $input["content"],
                    "hasChange" => true

                ];
                $result = $db->patchData($id, $data);
                return $result;
            }

        }
        public static function deletePrivMsg($id) {
            $db = new DBAccess("priv_msgs");
            $result = $db->findById($id);
            if($result === null) {
                throw new Exception("The message couldn't be found");
            } else {
                return $db->deleteData($id);
            }
        }
    }

?>
