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

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = "public/uploads/";
		fs.mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

// --- Rotas da API ---

// Rota para listar as fotos
app.get("/api/photos", (req, res) => {
	// ✅ **NOVA LINHA:** Diz ao navegador para não guardar esta resposta em cache.
	res.setHeader("Cache-Control", "no-store");

	console.log(
		`[${new Date().toLocaleTimeString()}] Recebida requisição para /api/photos`
	);

	const directoryPath = path.join(__dirname, "public/uploads");
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			if (err.code === "ENOENT") {
				console.log(
					"Diretório 'public/uploads' não encontrado, retornando lista vazia."
				);
				return res.json([]);
			}
			console.error("Erro ao ler o diretório de uploads:", err);
			return res
				.status(500)
				.json({ message: "Não foi possível ler as fotos." });
		}

		const imageFiles = files
			.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
			.map((file) => `uploads/${file}`)
			.reverse();

		console.log(`Encontradas ${imageFiles.length} fotos. Enviando lista.`);
		res.json(imageFiles);
	});
});

// Rota para fazer o upload de uma nova foto
app.post("/api/upload", upload.single("photo"), (req, res) => {
	if (!req.file) {
		return res
			.status(400)
			.json({ success: false, message: "Nenhum arquivo enviado." });
	}
	console.log(`Upload bem-sucedido: ${req.file.filename}`);
	res.json({ success: true, url: `uploads/${req.file.filename}` });
});

// Inicia o servidor
app.listen(port, () => {
	console.log(`🎉 Servidor backend rodando em http://localhost:${port}`);
	console.log("Aguardando requisições do frontend...");
});
