import { useEffect, useRef } from 'react';
import './LighthouseEffect.css';

interface LighthouseEffectProps {
	dayImageUrl: string;
	nightImageUrl: string;
}

export function LighthouseEffect({ dayImageUrl, nightImageUrl }: LighthouseEffectProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dayImageRef = useRef<HTMLImageElement | null>(null);
	const nightImageRef = useRef<HTMLImageElement | null>(null);
	const animationRef = useRef<number | null>(null);
	const textCanvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		let textCanvas = textCanvasRef.current;
		let textCtx: CanvasRenderingContext2D | null = null;

		if (!textCanvas) {
			textCanvas = document.createElement('canvas');
			textCanvas.style.position = 'fixed';
			textCanvas.style.top = '0';
			textCanvas.style.left = '0';
			textCanvas.style.pointerEvents = 'none';
			textCanvas.style.zIndex = '4';
			document.body.appendChild(textCanvas);
			textCanvasRef.current = textCanvas;

			const style = document.createElement('style');
			style.textContent = `
				.lighthouse-effect-container {
					z-index: 1;
				}
				.lighthouse-effect-container img {
					z-index: 1;
				}
			`;
			document.head.appendChild(style);
		}

		textCtx = textCanvas.getContext('2d');

		const canvas = canvasRef.current;

		if (!canvas || !textCanvas) {
			return
		};

		const ctx = canvas.getContext('2d');

		if (!ctx || !textCtx) {
			return
		};

		let mouseX = 0;
		let mouseY = 0;
		const radius = 200;

		function resizeCanvas() {
			if (!canvas || !textCanvas) {
				return;
			}

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			textCanvas.width = window.innerWidth;
			textCanvas.height = window.innerHeight;
		}

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		const handleMouseMove = (e: MouseEvent) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
		};

		document.addEventListener('mousemove', handleMouseMove);

		function animate() {
			if (!ctx || !canvas || !textCtx || !textCanvas) {
				return;
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

			if (!dayImageRef.current || !nightImageRef.current) return;

			const nightRect = nightImageRef.current.getBoundingClientRect();
			const imgAspect = dayImageRef.current.width / dayImageRef.current.height;
			const displayAspect = nightRect.width / nightRect.height;

			let drawWidth, drawHeight, drawX, drawY;
			let sourceX, sourceY, sourceWidth, sourceHeight;

			drawWidth = nightRect.width;
			drawHeight = nightRect.height;
			drawX = nightRect.left;
			drawY = nightRect.top;

			if (imgAspect > displayAspect) {
				sourceHeight = dayImageRef.current.height;
				sourceWidth = sourceHeight * displayAspect;
				sourceX = (dayImageRef.current.width - sourceWidth) / 2;
				sourceY = 0;
			} else {
				sourceWidth = dayImageRef.current.width;
				sourceHeight = sourceWidth / displayAspect;
				sourceX = 0;
				sourceY = (dayImageRef.current.height - sourceHeight) / 2;
			}

			ctx.save();
			ctx.beginPath();
			ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
			ctx.clip();

			ctx.drawImage(dayImageRef.current, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, drawWidth, drawHeight);

			ctx.restore();

			textCtx.fillStyle = 'rgba(255, 255, 255, 0)';
			textCtx.beginPath();
			textCtx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
			textCtx.fill();

			animationRef.current = requestAnimationFrame(animate);
		}

		const dayImage = new Image();
		dayImage.src = dayImageUrl;
		dayImageRef.current = dayImage;

		dayImage.onload = () => {
			animate();
		};

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			document.removeEventListener('mousemove', handleMouseMove);
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			if (textCanvasRef.current && textCanvasRef.current.parentNode) {
				textCanvasRef.current.parentNode.removeChild(textCanvasRef.current);
			}
		};
	}, [dayImageUrl]);

	return (
		<>
			<div class="lighthouse-effect-container">
				<img ref={nightImageRef} src={nightImageUrl} alt="Night" />
			</div>

			<canvas
				ref={canvasRef}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					pointerEvents: 'none',
					zIndex: 1,
				}}
			/>
		</>
	);
};

export default LighthouseEffect;