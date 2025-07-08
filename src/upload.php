<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

require 'db_connect.php';

$target_dir = "uploads/";
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}

$response = ["success" => false];

if (isset($_FILES["photo"])) {
    $file = $_FILES["photo"];
    if ($file["error"] == UPLOAD_ERR_OK) {
        $file_name = basename($file["name"]);
        $safe_filename = preg_replace("/[^a-zA-Z0-9._-]/", "", $file_name);
        $unique_name = uniqid() . '-' . $safe_filename;
        $target_file_path = $target_dir . $unique_name;

        if (move_uploaded_file($file["tmp_name"], $target_file_path)) {
            // Monta a URL pública do arquivo
            $protocol = (!empty($_SERVER['HTTPS']) || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
            $domain = $_SERVER['HTTP_HOST'];
            $base_path = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
            $full_url = $protocol . $domain . $base_path . '/' . $target_file_path;

            // Salva no banco
            $stmt = $conn->prepare("INSERT INTO photos (url) VALUES (?)");
            $stmt->bind_param("s", $full_url);

            if ($stmt->execute()) {
                $response = ["success" => true, "url" => $full_url];
            } else {
                $response["message"] = "Erro ao salvar no banco: " . $stmt->error;
            }

            $stmt->close();
        } else {
            $response["message"] = "Erro ao mover o arquivo.";
        }
    } else {
        $response["message"] = "Erro no upload: " . $file["error"];
    }
} else {
    $response["message"] = "Nenhum arquivo recebido.";
}

$conn->close();
echo json_encode($response);
