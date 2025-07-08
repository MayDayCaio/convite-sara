<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Teste de Galeria</title>
    <style>
        body { font-family: sans-serif; background: #222; color: #fff; }
        img { max-width: 200px; border: 2px solid #fff; margin: 10px; }
        .success { border-color: limegreen; }
        .error { border-color: crimson; color: crimson; }
    </style>
</head>
<body>
    <h1>Teste de Galeria de Fotos</h1>
    <p>Se as imagens aparecerem abaixo com uma borda <strong>verde</strong>, os caminhos e as permissões estão corretos.</p>
    <hr>

    <?php
    require 'db_connect.php';

    $sql = "SELECT url FROM photos ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $url = $row['url'];
            $path = $_SERVER['DOCUMENT_ROOT'] . parse_url($url, PHP_URL_PATH);

            if (file_exists($path)) {
                echo "<img src='" . htmlspecialchars($url) . "' class='success' alt='Imagem' />";
            } else {
                echo "<p class='error'>Erro: Arquivo não encontrado em: <code>" . htmlspecialchars($path) . "</code></p>";
            }
        }
    } else {
        echo "<p>Nenhuma foto encontrada na base de dados.</p>";
    }

    $conn->close();
    ?>
</body>
</html>
