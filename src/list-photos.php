<?php
header('Content-Type: application/json');

require 'db_connect.php';

$photos = [];

$sql = "SELECT url FROM photos ORDER BY id DESC"; // ou created_at DESC se houver
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $photos[] = $row['url'];
    }
}

$conn->close();
echo json_encode($photos);
