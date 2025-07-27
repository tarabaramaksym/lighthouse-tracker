import { useEffect, useRef } from 'react';
import './LighthouseEffect.css';

interface LighthouseEffectProps {
	dayImageUrl: string;
	nightImageUrl: string;
	borderRadius?: string;
	radius?: number;
	auto?: boolean;
	isFixed?: boolean;
}

export function LighthouseEffect({ dayImageUrl, nightImageUrl, borderRadius = '0', radius = 200, auto = false, isFixed = false }: LighthouseEffectProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dayImageRef = useRef<HTMLImageElement | null>(null);

	const nightImageRef = useRef<HTMLImageElement | null>(null);
	const animationRef = useRef<number | null>(null);
	const textCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const autoAnimationRef = useRef<number | null>(null);
	const isUserControlledRef = useRef<boolean>(false);
	const autoTimeRef = useRef<number>(0);
	const isHoveringImageRef = useRef<boolean>(false);
	const autoDirectionRef = useRef<{ x: number; y: number }>({ x: 1, y: 1 });

	useEffect(() => {
		console.log('test');
		const textCanvas = textCanvasRef.current;
		let textCtx: CanvasRenderingContext2D | null = null;

		if (textCanvas) {
			textCtx = textCanvas.getContext('2d');
		}

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

		const initializeMousePosition = () => {
			if (nightImageRef.current) {
				const rect = nightImageRef.current.getBoundingClientRect();
				mouseX = rect.width / 2;
				mouseY = rect.height / 2;
			}
		};

		initializeMousePosition();

		function resizeCanvas() {
			if (!canvas || !nightImageRef.current) {
				return;
			}

			const rect = nightImageRef.current.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
			//canvas.style.left = `${rect.left}px`;
			//canvas.style.top = `${rect.top}px`;
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${rect.height}px`;

			if (textCanvas) {
				textCanvas.width = rect.width;
				textCanvas.height = rect.height;
				//textCanvas.style.left = `${rect.left}px`;
				//textCanvas.style.top = `${rect.top}px`;
				textCanvas.style.width = `${rect.width}px`;
				textCanvas.style.height = `${rect.height}px`;
			}
		}

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		const handleMouseMove = (e: MouseEvent) => {
			if (nightImageRef.current) {
				const rect = nightImageRef.current.getBoundingClientRect();
				const isInside = e.clientX >= rect.left &&
					e.clientX <= rect.right &&
					e.clientY >= rect.top &&
					e.clientY <= rect.bottom;

				if (isInside) {
					mouseX = e.clientX - rect.left;
					mouseY = e.clientY - rect.top;
					if (!isUserControlledRef.current && auto) {
						autoTimeRef.current = Date.now() * 0.001;
					}
					isUserControlledRef.current = true;
					isHoveringImageRef.current = true;
				} else if (isHoveringImageRef.current) {
					isHoveringImageRef.current = false;
					if (auto) {
						const rect = nightImageRef.current.getBoundingClientRect();
						const centerX = rect.width / 2;
						const centerY = rect.height / 2;

						autoTimeRef.current = Date.now() * 0.001;
						isUserControlledRef.current = false;
					}
				}
			}

			if (!auto) {
				if (nightImageRef.current) {
					const rect = nightImageRef.current.getBoundingClientRect();
					mouseX = e.clientX - rect.left;
					mouseY = e.clientY - rect.top;
					isUserControlledRef.current = true;
					isHoveringImageRef.current = true;
				}
			}
		};

		document.addEventListener('mousemove', handleMouseMove);


		const startAutoMovement = () => {
			if (!auto) return;

			const autoMove = () => {
				if (isUserControlledRef.current) {
					autoAnimationRef.current = requestAnimationFrame(autoMove);
					return;
				}

				if (nightImageRef.current) {
					const rect = nightImageRef.current.getBoundingClientRect();

					mouseX += autoDirectionRef.current.x;
					mouseY += autoDirectionRef.current.y;

					if (mouseX <= 0 || mouseX >= rect.width) {
						autoDirectionRef.current.x *= -1;
					}
					if (mouseY <= 0 || mouseY >= rect.height) {
						autoDirectionRef.current.y *= -1;
					}

					mouseX = Math.max(0, Math.min(rect.width, mouseX));
					mouseY = Math.max(0, Math.min(rect.height, mouseY));
				}

				autoAnimationRef.current = requestAnimationFrame(autoMove);
			};

			autoMove();
		};

		if (auto) {
			autoTimeRef.current = Date.now() * 0.001;
			setTimeout(startAutoMovement, 1000);
		}

		function animate() {
			if (!ctx || !canvas) {
				return;
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (textCtx && textCanvas) {
				textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
			}

			if (!dayImageRef.current || !nightImageRef.current) {
				return
			};


			if (!auto && !isHoveringImageRef.current) {
				animationRef.current = requestAnimationFrame(animate);
				return;
			}

			const nightRect = nightImageRef.current.getBoundingClientRect();
			const imgAspect = dayImageRef.current.width / dayImageRef.current.height;
			const displayAspect = nightRect.width / nightRect.height;

			let drawWidth, drawHeight, drawX, drawY;
			let sourceX, sourceY, sourceWidth, sourceHeight;

			drawWidth = nightRect.width;
			drawHeight = nightRect.height;
			drawX = 0;
			drawY = 0;

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

			const borderRadiusValue = parseInt(borderRadius) || 0;
			if (borderRadiusValue > 0) {
				const clipPath = new Path2D();
				clipPath.roundRect(0, 0, drawWidth, drawHeight, borderRadiusValue);
				ctx.clip(clipPath);
			}

			ctx.beginPath();
			ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
			ctx.clip();

			ctx.drawImage(dayImageRef.current, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, drawWidth, drawHeight);

			ctx.restore();

			if (textCtx) {
				textCtx.fillStyle = 'rgba(255, 255, 255, 0)';
				textCtx.beginPath();
				textCtx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
				textCtx.fill();
			}

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
			if (autoAnimationRef.current) {
				cancelAnimationFrame(autoAnimationRef.current);
			}
		};
	}, [dayImageUrl, nightImageUrl, auto, radius]);

	return (
		<>
			<div class="lighthouse-effect-container" style={{ borderRadius }}>
				<img ref={nightImageRef} src={nightImageUrl} alt="Night" style={{ borderRadius }} />
				<canvas
					ref={canvasRef}
					style={{
						top: '0',
						left: '0',
						position: 'absolute',
						pointerEvents: 'none',
						zIndex: 1,
					}}
				/>
				<canvas
					ref={textCanvasRef}
					style={{
						top: '0',
						left: '0',
						position: 'absolute',
						pointerEvents: 'none',
						zIndex: 4,
					}}
				/>
			</div>


		</>
	);
};

export default LighthouseEffect;