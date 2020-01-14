<?php

error_reporting(E_ALL);
  ini_set("display_errors", 1);

  ini_set( 'date.timezone', 'Asia/Seoul' );

  if (!empty($_POST["password"])){

    $_POST["password"] = "khan3701*_*";

    $ch3 = curl_init();
    curl_setopt($ch3, CURLOPT_URL, "https://script.google.com/macros/s/AKfycbxu2iKv0LW3OeOCZDt5E9ofS347Fx56X3x12iKF/exec");
    curl_setopt($ch3, CURLOPT_POST, 1);
    curl_setopt($ch3, CURLOPT_POSTFIELDS, http_build_query($_POST));
    curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, 0);
    $result_write = curl_exec($ch3);
    curl_close($ch3);

  } else {

    $url = "https://spreadsheets.google.com/feeds/list/1KkVIw_CYB8j7JhZcaGW54aXr4p9-3jHLGD5W69lrbwE/1/public/basic?alt=json-in-script";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    $result = curl_exec($ch);
    curl_close($ch);

    $result = str_replace("gdata.io.handleScriptLoaded(", "", $result);
    $result = str_replace("$", "", $result);
    $result = substr_replace($result, "", strlen($result)-1);
    $result = substr_replace($result, "", strlen($result)-1);

    $data = json_decode($result);

    $entry = $data -> feed -> entry;

    $listLength = count($entry);

    $allSum = array();
    $type = array("all", "10", "20", "30", "40", "50", "60", "M", "F", "Q", "10M", "10F", "10Q", "20M", "20F", "20Q", "30M", "30F", "30Q", "40M", "40F", "40Q", "50M", "50F", "50Q", "60M", "60F", "60Q");
    for ($t = 0; $t < count($type); $t++){
        array_push($allSum, array("type" => $type[$t], "count" => 0));
    }

    for ($k = 0; $k < $listLength; $k++){

        $n_genderValue = $entry[$k] -> title -> t;
        $content = $entry[$k] -> content -> t;

        $record = array();
        $rawList = explode(",", $content);
        $recordLength = count($rawList) - 1;

        $record["ngender"] = $n_genderValue;

        for ($r = 0; $r < $recordLength; $r++){
            $rawData = explode(":", $rawList[$r]);
            $name = trim($rawData[0]);
            $value = trim($rawData[1]);
            $record[$name] = $value;
        }

        // 레코드 키값으로 배열 생성
        $reKeys = array_keys($record);
        $reKeys = array_diff($reKeys, array("comment"));

        // 키값 초기화
        if (!array_key_exists("ngender", $allSum[0])){
            for($a = 0; $a < count($allSum); $a++){
                foreach ($reKeys as $rk){
                    if ($rk != "agegroup" && $rk != "sex"){
                        $allSum[$a][$rk] = 0;
                    }
                }
            }
        }

        foreach($reKeys as $rk){
            if ($rk != "agegroup" && $rk != "sex"){
                $allSum[0][$rk] += (int)$record[$rk];
            }
        }


        for($a = 0; $a < count($allSum); $a++){

            $typeKey = "";
            if (array_key_exists("agegroup", $record)){
                $typeKey .= $record["agegroup"];
            }
            if (array_key_exists("sex", $record)){
                $typeKey .= $record["sex"];
            }

            if ($typeKey != ""){

                if (strpos($typeKey, $allSum[$a]["type"]) !== false){
                    foreach($reKeys as $rk){
                        if ($rk != "agegroup" && $rk != "sex"){
                            $allSum[$a][$rk] += (int)$record[$rk];
                        }
                    }

                    $allSum[$a]["count"]++;

                }

            }

        }

        $allSum[0]["count"]++;

    }

    echo json_encode($allSum);

  }

?>
