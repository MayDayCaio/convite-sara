// src/App.jsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
	Heart,
	MapPin,
	Clock,
	Calendar,
	Map,
	CalendarPlus,
	Gift,
	X,
	Shirt,
	ToyBrick,
	Loader,
	Camera,
	Music,
	Music2,
	ChevronLeft,
	ChevronRight,
	Upload,
} from "lucide-react";
import profilePic from "./assets/2.png";

// URL do nosso novo servidor backend Node.js
const API_BASE_URL = "http://localhost:3001";

// --- Componentes Visuais (sem alterações) --- //
const DaisyVisual = () => (
	<div className="relative w-full h-full">
		<div className="absolute inset-0 m-auto w-1/3 h-1/3 bg-yellow-300 rounded-full z-10 shadow-md"></div>
		<div className="absolute inset-0 z-0 animate-spin-slow">
			{[...Array(8)].map((_, i) => (
				<div
					key={i}
					className="absolute w-1/2 h-full top-0 left-1/4"
					style={{ transform: `rotate(${i * (360 / 8)}deg)` }}>
					<div className="w-full h-1/2 bg-white/95 rounded-full"></div>
				</div>
			))}
		</div>
	</div>
);
const FloatingDaisy = ({ style }) => (
	<div className="absolute" style={style}>
		<DaisyVisual />
	</div>
);
const Firefly = ({ style }) => (
	<div className="absolute rounded-full bg-yellow-200" style={style}></div>
);

// --- Componente Principal --- //
function App() {
	const [hasInteracted, setHasInteracted] = useState(false);
	const [activeModal, setActiveModal] = useState(null);
	const [timeLeft, setTimeLeft] = useState({});
	const [isMusicPlaying, setIsMusicPlaying] = useState(false);
	const audioRef = useRef(null);
	const [photos, setPhotos] = useState([]);
	const [arePhotosLoading, setArePhotosLoading] = useState(true);

	// MODIFICADO: Busca as fotos do nosso novo servidor Node.js
	useEffect(() => {
		fetch(`${API_BASE_URL}/api/photos`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`A resposta da rede não foi boa`);
				}
				return response.json();
			})
			.then((serverPhotos) => {
				setPhotos(serverPhotos);
				setArePhotosLoading(false);
			})
			.catch((error) => {
				console.error("Erro ao buscar fotos:", error);
				alert(
					`Não foi possível carregar as recordações. Verifique a consola para mais detalhes.`
				);
				setArePhotosLoading(false);
			});
	}, []);

	// O resto da lógica do App (countdown, música, etc.) permanece o mesmo...
	useEffect(() => {
		const timer = setInterval(() => {
			const partyDate = new Date("2025-08-17T12:00:00").getTime();
			const now = new Date().getTime();
			const distance = partyDate - now;
			if (distance < 0) {
				clearInterval(timer);
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			} else {
				setTimeLeft({
					days: Math.floor(distance / 86400000),
					hours: Math.floor((distance % 86400000) / 3600000),
					minutes: Math.floor((distance % 3600000) / 60000),
					seconds: Math.floor((distance % 60000) / 1000),
				});
			}
		}, 1000);
		return () => clearInterval(timer);
	}, []);
	const handleEnter = () => {
		setHasInteracted(true);
		if (audioRef.current && !isMusicPlaying) {
			audioRef.current
				.play()
				.then(() => setIsMusicPlaying(true))
				.catch((error) =>
					console.error("A reprodução automática do áudio falhou:", error)
				);
		}
	};
	const toggleMusic = () => {
		if (!audioRef.current) return;
		if (isMusicPlaying) {
			audioRef.current.pause();
		} else {
			audioRef.current
				.play()
				.catch((e) => console.error("Erro ao tocar áudio:", e));
		}
		setIsMusicPlaying(!isMusicPlaying);
	};
	const sceneryElements = useMemo(
		() =>
			Array.from({ length: 45 }).map((_, i) =>
				Math.random() > 0.4 ? (
					<FloatingDaisy
						key={`daisy-${i}`}
						style={{
							left: `${Math.random() * 100}vw`,
							width: `${20 + Math.random() * 40}px`,
							height: `${20 + Math.random() * 40}px`,
							opacity: 0,
							animation: `float-sway linear infinite`,
							animationDelay: `${Math.random() * 2}s`,
							animationDuration: `${15 + Math.random() * 20}s`,
							"--x-sway": `${Math.random() * 20 - 10}vw`,
							"--x-sway-end": `${Math.random() * 40 - 20}vw`,
						}}
					/>
				) : (
					<Firefly
						key={`firefly-${i}`}
						style={{
							top: `${10 + Math.random() * 80}vh`,
							left: `${10 + Math.random() * 80}vw`,
							width: `${2 + Math.random() * 3}px`,
							height: `${2 + Math.random() * 3}px`,
							"--x1": `${Math.random() * 50 - 25}px`,
							"--y1": `${Math.random() * 50 - 25}px`,
							"--x2": `${Math.random() * 50 - 25}px`,
							"--y2": `${Math.random() * 50 - 25}px`,
							"--x3": `${Math.random() * 50 - 25}px`,
							"--y3": `${Math.random() * 50 - 25}px`,
							animation: `twinkle 4s ease-in-out infinite, firefly-move ${
								6 + Math.random() * 8
							}s ease-in-out infinite`,
							animationDelay: `${Math.random() * 4}s, ${
								Math.random() * (6 + Math.random() * 8)
							}s`,
						}}
					/>
				)
			),
		[]
	);
	const gardenDaisies = useMemo(
		() =>
			[
				{
					top: "5%",
					left: "-10%",
					size: 60,
					opacity: 0.7,
					rotation: -30,
					zIndex: 5,
				},
				{
					top: "60%",
					right: "-15%",
					size: 70,
					opacity: 0.8,
					rotation: 20,
					zIndex: 5,
				},
				{
					top: "80%",
					left: "10%",
					size: 50,
					opacity: 0.6,
					rotation: -10,
					zIndex: 5,
				},
				{
					top: "30%",
					left: "-15%",
					size: 40,
					opacity: 0.65,
					rotation: 40,
					zIndex: 5,
				},
				{
					top: "5%",
					right: "-5%",
					size: 50,
					opacity: 0.7,
					rotation: -20,
					zIndex: 5,
				},
				{
					top: "90%",
					right: "25%",
					size: 45,
					opacity: 0.6,
					rotation: 30,
					zIndex: 5,
				},
				{
					bottom: "-10%",
					left: "-5%",
					size: 80,
					opacity: 1,
					rotation: 15,
					zIndex: 15,
				},
				{
					bottom: "5%",
					right: "-8%",
					size: 60,
					opacity: 0.9,
					rotation: -25,
					zIndex: 15,
				},
				{
					top: "-8%",
					right: "15%",
					size: 55,
					opacity: 1,
					rotation: 35,
					zIndex: 15,
				},
				{
					bottom: "20%",
					left: "-12%",
					size: 55,
					opacity: 0.95,
					rotation: -50,
					zIndex: 15,
				},
				{
					bottom: "-12%",
					right: "10%",
					size: 70,
					opacity: 1,
					rotation: 25,
					zIndex: 15,
				},
				{
					top: "40%",
					right: "-18%",
					size: 45,
					opacity: 0.9,
					rotation: -40,
					zIndex: 15,
				},
				{
					top: "-10%",
					left: "15%",
					size: 40,
					opacity: 1,
					rotation: -20,
					zIndex: 15,
				},
				{
					bottom: "-5%",
					left: "30%",
					size: 60,
					opacity: 0.9,
					rotation: 5,
					zIndex: 15,
				},
			].map((pos, i) => (
				<div
					key={`garden-daisy-${i}`}
					className="absolute"
					style={{
						...pos,
						width: `${pos.size}px`,
						height: `${pos.size}px`,
						transform: `rotate(${pos.rotation}deg)`,
						animation: "pulse-gentle 6s ease-in-out infinite",
						animationDelay: `${i * 0.8}s`,
					}}>
					<DaisyVisual />
				</div>
			)),
		[]
	);
	const eventLocationText = "Chácara Flor do caribe, Arcoverde - PE";
	const googleMapsUrl = "https://maps.app.goo.gl/eFWfvTqHRcJzZ3WU7";
	const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=1%C2%BA+Aninho+de+Sarah+Marcella&dates=20250817T150000Z/20250817T190000Z&details=Venha+celebrar+conosco+no+Jardim+Encantado+da+Sarah!&location=${encodeURIComponent(
		eventLocationText
	)}`;
	const parentsMessage =
		"Com os corações cheios de alegria, convidamos você para celebrar o primeiro ano da nossa pequena flor. A sua presença é o maior presente que poderíamos desejar. Vamos criar memórias doces juntos! Com carinho, Papá e Mamã.";

	return (
		<div className="relative h-screen w-full bg-gradient-to-b from-[#1e2a47] via-[#283e66] to-[#4a6fa5] font-sans overflow-hidden p-4 flex items-center justify-center">
			<style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap'); @keyframes float-sway { 0% { transform: translateY(110vh); opacity: 0; } 10% { opacity: 1; } 50% { transform: translateY(50vh) translateX(var(--x-sway)); } 90% { opacity: 1; } 100% { transform: translateY(-10vh) translateX(var(--x-sway-end)); opacity: 0; } } @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes twinkle { 0%, 100% { box-shadow: 0 0 5px 2px #fef08a, 0 0 1px 1px #fef08a inset; opacity: 0.8; transform: scale(1); } 50% { box-shadow: 0 0 10px 3px #fef08a, 0 0 2px 2px #fef08a inset; opacity: 1; transform: scale(1.1); } } @keyframes firefly-move { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(var(--x1), var(--y1)); } 50% { transform: translate(var(--x2), var(--y2)); } 75% { transform: translate(var(--x3), var(--y3)); } } @keyframes card-enter { from { transform: translateY(20px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } } @keyframes pulse-gentle { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } .animate-spin-slow { animation: spin-slow 25s linear infinite; } .animate-card-enter { animation: card-enter 0.8s ease-out forwards; } .modal-content { animation: slide-up 0.5s ease-out forwards; } .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(254, 240, 138, 0.5); border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(253, 224, 71, 0.7); }`}</style>
			<audio
				ref={audioRef}
				src="https://cdn.pixabay.com/download/audio/2022/08/04/audio_2dde649a80.mp3?filename=inspiring-cinematic-ambient-116199.mp3"
				loop
				preload="auto"
				onPlay={() => setIsMusicPlaying(true)}
				onPause={() => setIsMusicPlaying(false)}
			/>
			{!hasInteracted ? (
				<div className="z-[100] text-center animate-fade-in">
					<div className="w-48 h-48 mx-auto mb-6">
						<DaisyVisual />
					</div>
					<h1
						className="text-white text-5xl font-bold mb-4"
						style={{ fontFamily: "'Dancing Script', cursive" }}>
						Sarah Marcella
					</h1>
					<p className="text-yellow-200 text-xl mb-8">
						Convite de aniversario Sarah Marcela!
					</p>
					<button
						onClick={handleEnter}
						className="bg-yellow-400 text-gray-800 font-bold py-3 px-10 rounded-full text-lg transform transition-transform duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto">
						<Heart size={22} /> Entrar no Jardim das Margaridas
					</button>
				</div>
			) : (
				<>
					<button
						onClick={toggleMusic}
						className="fixed top-4 right-4 z-[60] text-white bg-black/30 p-2 rounded-full backdrop-blur-sm hover:bg-black/50 transition animate-pulse-gentle">
						{isMusicPlaying ? <Music size={20} /> : <Music2 size={20} />}
					</button>
					{sceneryElements}
					<div className="relative w-full max-w-sm flex items-center justify-center">
						{gardenDaisies}
						<main className="relative z-10 w-full bg-white/10 backdrop-blur-md text-white rounded-3xl p-6 pb-12 shadow-2xl shadow-black/30 border border-white/20 animate-card-enter max-h-[90vh] overflow-y-auto custom-scrollbar">
							<div className="text-center space-y-4">
								<h1
									className="text-5xl font-bold"
									style={{ fontFamily: "'Dancing Script', cursive" }}>
									Sarah Marcella
								</h1>
								<p className="text-xl font-light text-yellow-200 mt-1">
									celebra seu 1º aninho!
								</p>
								<div className="w-24 h-24 mx-auto my-4 rounded-full border-4 border-yellow-300 p-1 shadow-lg">
									<img
										src={profilePic}
										alt="Foto de Sarah Marcella"
										className="rounded-full w-full h-full object-cover"
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"https://placehold.co/100x100/EED9C4/7B3F00?text=Foto";
										}}
									/>
								</div>
								<div className="grid grid-cols-4 gap-2 text-center my-4">
									<div>
										<div className="text-3xl font-bold text-yellow-300">
											{timeLeft.days || "0"}
										</div>
										<div className="text-xs">dias</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-yellow-300">
											{timeLeft.hours || "0"}
										</div>
										<div className="text-xs">horas</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-yellow-300">
											{timeLeft.minutes || "0"}
										</div>
										<div className="text-xs">min</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-yellow-300">
											{timeLeft.seconds || "0"}
										</div>
										<div className="text-xs">seg</div>
									</div>
								</div>
								<p className="text-lg italic text-white/90">
									"No meu jardim das margaridas, a flor mais especial é você!"
								</p>
								<div className="space-y-3 text-left bg-black/20 p-4 rounded-xl">
									<p className="flex items-center gap-3">
										<Calendar size={20} className="text-yellow-300" />{" "}
										<span>17 de Agosto de 2025</span>
									</p>
									<p className="flex items-center gap-3">
										<Clock size={20} className="text-yellow-300" />{" "}
										<span>Às 12:00 (Meio-dia)</span>
									</p>
									<p className="flex items-center gap-3">
										<MapPin size={20} className="text-yellow-300" />{" "}
										<span>Chácara Flor do Caribe, Arcoverde-PE</span>
									</p>
								</div>
								<div className="text-left bg-black/20 p-4 rounded-xl text-sm italic text-white/80">
									{parentsMessage}
								</div>
							</div>
							<div className="mt-6 grid grid-cols-2 gap-3">
								<a
									href={googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-black/20 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-black/40">
									<Map size={18} /> Ver no Mapa
								</a>
								<a
									href={googleCalendarUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-black/20 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-black/40">
									<CalendarPlus size={18} /> Adicionar ao Calendário
								</a>
								<button
									onClick={() => setActiveModal("gifts")}
									className="bg-black/20 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-black/40">
									<Gift size={18} /> Presentes
								</button>
								<button
									onClick={() => setActiveModal("photos")}
									className="bg-black/20 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors hover:bg-black/40">
									<Camera size={18} /> Recordações
								</button>
							</div>
							<div className="mt-4">
								<button
									onClick={() => setActiveModal("rsvp")}
									className="w-full bg-yellow-400 text-gray-800 font-bold py-3 px-6 rounded-full text-lg transform transition-transform duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2">
									<Heart size={22} /> Confirmar Presença
								</button>
							</div>
						</main>
					</div>
					{activeModal === "rsvp" && (
						<RSVPForm onClose={() => setActiveModal(null)} />
					)}
					{activeModal === "gifts" && (
						<GiftListModal onClose={() => setActiveModal(null)} />
					)}
					{activeModal === "photos" && (
						<PhotoGalleryModal
							onClose={() => setActiveModal(null)}
							photos={photos}
							setPhotos={setPhotos}
							isLoading={arePhotosLoading}
						/>
					)}
				</>
			)}
		</div>
	);
}

// --- Componentes Modais --- //
const Modal = ({ onClose, children }) => (
	<div
		className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
		onClick={onClose}>
		<div
			className="bg-gradient-to-br from-[#283e66] to-[#4a6fa5] rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-white/20 modal-content"
			onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	</div>
);
const RSVPForm = ({ onClose }) => {
	const [name, setName] = useState("");
	const [adults, setAdults] = useState(1);
	const [children, setChildren] = useState(0);
	const [submissionStatus, setSubmissionStatus] = useState("");
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmissionStatus("A enviar a confirmação...");
		const scriptURL =
			"AKfycbzC3J9W939vSTM-NfpHtNWj2K7buSfNnqvF1wmfbRroa4pa57W3rz2wh0bm18Gr8CyS";
		const formData = new FormData();
		formData.append("Nome", name);
		formData.append("Adultos", adults);
		formData.append("Crianças", children);
		fetch(scriptURL, { method: "POST", body: formData })
			.then((response) => {
				setSubmissionStatus(`🎉 Oba, ${name}! Presença confirmada.`);
				setName("");
				setAdults(1);
				setChildren(0);
			})
			.catch((error) => {
				setSubmissionStatus("❌ Ups! Ocorreu um erro.");
				console.error("Erro!", error.message);
			});
	};
	return (
		<Modal onClose={onClose}>
			<div className="flex justify-between items-center mb-3">
				<h2
					className="text-center text-2xl font-bold text-yellow-300"
					style={{ fontFamily: "'Dancing Script', cursive" }}>
					Confirmar Presença
				</h2>
				<button
					onClick={onClose}
					className="text-white/70 hover:text-white transition">
					<X size={24} />
				</button>
			</div>
			{submissionStatus ? (
				<p className="text-center text-lg p-4 bg-black/30 rounded-lg animate-pulse">
					{submissionStatus}
				</p>
			) : (
				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-white/80 mb-1">
							Seu nome completo:
						</label>
						<input
							type="text"
							id="name"
							className="w-full p-2 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							placeholder="Seu nome"
						/>
					</div>
					<div className="flex gap-3">
						<div className="w-1/2">
							<label
								htmlFor="adults"
								className="block text-sm font-medium text-white/80 mb-1">
								Adultos:
							</label>
							<input
								type="number"
								id="adults"
								className="w-full p-2 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
								value={adults}
								onChange={(e) => setAdults(e.target.value)}
								min="1"
								required
							/>
						</div>
						<div className="w-1/2">
							<label
								htmlFor="children"
								className="block text-sm font-medium text-white/80 mb-1">
								Crianças:
							</label>
							<input
								type="number"
								id="children"
								className="w-full p-2 text-sm bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
								value={children}
								onChange={(e) => setChildren(e.target.value)}
								min="0"
								required
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={!name}
						className="w-full bg-yellow-400 text-gray-800 font-bold py-2.5 rounded-full text-base transition-transform duration-300 hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
						Enviar Confirmação
					</button>
				</form>
			)}
		</Modal>
	);
};
const GiftListModal = ({ onClose }) => {
	const giftList = [
		{ id: 1, icon: <Shirt size={24} />, name: "Roupinhas (Tamanho 2)" },
		{ id: 2, icon: <ToyBrick size={24} />, name: "Brinquedos Educativos" },
	];
	return (
		<Modal onClose={onClose}>
			<div className="flex justify-between items-center mb-4">
				<h2
					className="text-2xl text-yellow-300 font-bold"
					style={{ fontFamily: "'Dancing Script', cursive" }}>
					Lista de Presentes
				</h2>
				<button
					onClick={onClose}
					className="text-white/70 hover:text-white transition">
					<X size={24} />
				</button>
			</div>
			<div className="space-y-3">
				{giftList.map((gift, index) => (
					<div
						key={gift.id}
						className="flex items-center gap-4 bg-black/20 p-3 rounded-lg"
						style={{
							animation: `slide-up 0.5s ${index * 0.1}s ease-out backwards`,
						}}>
						<span className="text-yellow-300">{gift.icon}</span>
						<span className="text-white text-md">{gift.name}</span>
					</div>
				))}
			</div>
		</Modal>
	);
};

// MODIFICADO: Componente PhotoGalleryModal totalmente atualizado para usar o backend Node.js
const PhotoGalleryModal = ({ onClose, photos, setPhotos, isLoading }) => {
	const [isUploading, setIsUploading] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const fileInputRef = useRef(null);

	const handleFileSelect = () => fileInputRef.current.click();

	const handlePhotoUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			setIsUploading(true);
			const formData = new FormData();
			formData.append("photo", file);

			fetch(`${API_BASE_URL}/api/upload`, {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						setPhotos((prevPhotos) => [data.url, ...prevPhotos]);
						setCurrentIndex(0);
					} else {
						alert("Erro ao enviar a foto: " + data.message);
					}
					setIsUploading(false);
				})
				.catch((error) => {
					console.error("Erro no upload:", error);
					alert("Ocorreu um erro de rede. Tente novamente.");
					setIsUploading(false);
				});
		}
	};

	const nextPhoto = () => setCurrentIndex((prev) => (prev + 1) % photos.length);
	const prevPhoto = () =>
		setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);

	return (
		<Modal onClose={onClose}>
			<div className="flex justify-between items-center mb-2">
				<h2
					className="text-2xl text-yellow-300 font-bold"
					style={{ fontFamily: "'Dancing Script', cursive" }}>
					Recordações
				</h2>
				<button
					onClick={onClose}
					className="text-white/70 hover:text-white transition">
					<X size={24} />
				</button>
			</div>
			<div className="relative min-h-[300px] bg-black/20 rounded-lg flex items-center justify-center">
				{isLoading ? (
					<Loader className="animate-spin text-yellow-300" />
				) : photos.length > 0 ? (
					<>
						<img
							src={`${API_BASE_URL}/${photos[currentIndex]}`}
							alt={`Recordação ${currentIndex + 1}`}
							className="w-full h-auto max-h-[55vh] object-contain rounded-lg"
						/>
						{photos.length > 1 && (
							<>
								<button
									onClick={prevPhoto}
									className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 transition">
									<ChevronLeft size={24} />
								</button>
								<button
									onClick={nextPhoto}
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60 transition">
									<ChevronRight size={24} />
								</button>
							</>
						)}
					</>
				) : (
					<p className="text-white/70">
						Nenhuma recordação ainda. Seja o primeiro!
					</p>
				)}
			</div>
			{photos.length > 0 && (
				<p className="text-center text-sm text-white/70 mt-2">
					{currentIndex + 1} de {photos.length}
				</p>
			)}
			<div className="mt-4">
				<input
					type="file"
					accept="image/*"
					ref={fileInputRef}
					onChange={handlePhotoUpload}
					className="hidden"
				/>
				<button
					onClick={handleFileSelect}
					disabled={isUploading}
					className="w-full bg-yellow-400 text-gray-800 font-bold py-2.5 rounded-full text-base transition-transform duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:bg-yellow-200 disabled:cursor-not-allowed">
					{isUploading ? (
						<Loader className="animate-spin" />
					) : (
						<Upload size={18} />
					)}
					{isUploading ? "A enviar..." : "Adicionar uma Recordação"}
				</button>
			</div>
		</Modal>
	);
};

export default App;
