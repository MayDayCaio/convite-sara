// server.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(cors()); // Permite a comunicação com o frontend
// Informa que a pasta 'public' contém arquivos que podem ser acessados diretamente pela URL
app.use(express.static("public"));

// --- Configuração do Upload ---
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = "public/uploads/";
		fs.mkdirSync(uploadPath, { recursive: true }); // Garante que a pasta exista
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + path.extname(file.originalname);
		cb(null, uniqueName);
	},
});
const upload = multer({ storage: storage });

// --- API Endpoints ---

// 1. Endpoint para LISTAR as fotos
app.get("/api/photos", (req, res) => {
	console.log(`[SERVIDOR] Recebi um pedido para listar as fotos.`);
	const directoryPath = path.join(__dirname, "public/uploads");

	fs.readdir(directoryPath, (err, files) => {
		// Se a pasta não existir, retorna uma lista vazia.
		if (err) {
			return res.json([]);
		}

		// Filtra apenas por arquivos de imagem e cria o caminho relativo
		const photoUrls = files
			.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
			.map((file) => `uploads/${file}`) // Ex: 'uploads/12345.jpg' 

		console.log(
			`[SERVIDOR] Encontrei ${photoUrls.length} fotos. Enviando a lista.`
		);
		res.json(photoUrls);
	});
});

// 2. Endpoint para RECEBER uma nova foto
app.post("/api/upload", upload.single("photo"), (req, res) => {
	if (!req.file) {
		return res
			.status(400)
			.json({ success: false, message: "Nenhum arquivo enviado." });
	}
	console.log(`[SERVIDOR] Foto '${req.file.filename}' salva com sucesso.`);
	// Responde com sucesso e o caminho da nova foto
	res.json({ success: true, url: `uploads/${req.file.filename}` });
});

// --- Iniciar Servidor ---
app.listen(port, () => {
	console.log(`🎉 Servidor rodando em http://localhost:${port}`);
});
