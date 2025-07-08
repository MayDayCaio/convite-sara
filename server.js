// server.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";

const app = express();
const port = 3001; // Porta para o nosso backend

// Polyfill para __dirname em Módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Habilita o CORS
app.use(cors());

// Informa ao Express para servir arquivos estáticos da pasta 'public/uploads'
// Qualquer imagem em 'public/uploads' estará acessível via URL
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// --- Configuração do Upload (Multer) ---
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadPath = "public/uploads/";
		// Cria o diretório se ele não existir
		fs.mkdirSync(uploadPath, { recursive: true });
		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		// Cria um nome de arquivo único para evitar conflitos
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage });

// --- Rotas da API ---

// Rota para listar as fotos
app.get("/api/photos", (req, res) => {
	const directoryPath = path.join(__dirname, "public/uploads");
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			// Se o diretório não existir, retorna uma lista vazia em vez de um erro
			if (err.code === "ENOENT") {
				return res.json([]);
			}
			return res
				.status(500)
				.json({ message: "Não foi possível ler as fotos." });
		}

		const imageFiles = files
			.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
			.map((file) => `uploads/${file}`) // Retorna o caminho relativo
			.reverse(); // Os mais novos primeiro
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
	res.json({ success: true, url: `uploads/${req.file.filename}` });
});

// Inicia o servidor
app.listen(port, () => {
	console.log(`🎉 Servidor backend rodando em http://localhost:${port}`);
});
