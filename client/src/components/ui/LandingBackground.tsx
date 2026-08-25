import { useEffect, useRef } from "react";

type Trace = {
    points: { x: number; y: number }[];
    segmentLengths: number[];
    totalLength: number;
    progress: number;
    state: "drawing" | "holding" | "fading";
    holdTimer: number;
    fadeOpacity: number;
    speed: number;
};

function buildTrace(width: number, height: number): Trace {
    // Orthogonal (Manhattan-style) path: 2-4 segments, right-angle turns only
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const segCount = 2 + Math.floor(Math.random() * 3);
    const points = [{ x: startX, y: startY }];

    let cx = startX;
    let cy = startY;
    let horizontal = Math.random() > 0.5;

    for (let i = 0; i < segCount; i++) {
        const dist = 40 + Math.random() * 120;
        const dir = Math.random() > 0.5 ? 1 : -1;
        if (horizontal) {
            cx = Math.max(0, Math.min(width, cx + dist * dir));
        } else {
            cy = Math.max(0, Math.min(height, cy + dist * dir));
        }
        points.push({ x: cx, y: cy });
        horizontal = !horizontal;
    }

    const segmentLengths = points.slice(1).map((p, i) => {
        const prev = points[i];
        return Math.hypot(p.x - prev.x, p.y - prev.y);
    });
    const totalLength = segmentLengths.reduce((a, b) => a + b, 0);

    return {
        points,
        segmentLengths,
        totalLength,
        progress: 0,
        state: "drawing",
        holdTimer: 0,
        fadeOpacity: 1,
        speed: 0.4 + Math.random() * 0.5, // px per frame, roughly
    };
}

function pointAtProgress(trace: Trace, progress: number) {
    const target = trace.totalLength * progress;
    let covered = 0;
    for (let i = 0; i < trace.segmentLengths.length; i++) {
        const segLen = trace.segmentLengths[i];
        if (covered + segLen >= target || i === trace.segmentLengths.length - 1) {
            const segT = segLen === 0 ? 0 : (target - covered) / segLen;
            const a = trace.points[i];
            const b = trace.points[i + 1];
            return {
                x: a.x + (b.x - a.x) * Math.min(segT, 1),
                y: a.y + (b.y - a.y) * Math.min(segT, 1),
                segmentIndex: i,
            };
        }
        covered += segLen;
    }
    return { x: trace.points[0].x, y: trace.points[0].y, segmentIndex: 0 };
}

export function LandingBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let time = 0;
        const gridOffset = { x: 0, y: 0 };
        const gridSpeed = 0.12;

        const traceCount = 5;
        const traces: Trace[] = Array.from({ length: traceCount }, () =>
            buildTrace(canvas.width, canvas.height)
        );

        function drawStaticFrame() {
            if (!ctx || !canvas) return;
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = "oklch(1 0 0 / 0.04)";
            ctx.lineWidth = 0.5;
            for (let x = 0; x < width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        }

        if (prefersReducedMotion) {
            drawStaticFrame();
            return () => window.removeEventListener("resize", resizeCanvas);
        }

        let animationId: number;

        function animate() {
            time += 0.01;
            if (!canvas || !ctx) return;
            const { width, height } = canvas;

            ctx.clearRect(0, 0, width, height);

            // ── Grid (subtle drift) ──
            gridOffset.x = (gridOffset.x + gridSpeed) % 40;
            gridOffset.y = (gridOffset.y + gridSpeed) % 40;
            ctx.strokeStyle = "oklch(1 0 0 / 0.04)";
            ctx.lineWidth = 0.5;
            for (let x = -40 + gridOffset.x; x < width + 40; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = -40 + gridOffset.y; y < height + 40; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // ── Traces (plotter-drawn circuit paths) ──
            traces.forEach((trace, i) => {
                if (trace.state === "drawing") {
                    trace.progress += trace.speed / trace.totalLength;
                    if (trace.progress >= 1) {
                        trace.progress = 1;
                        trace.state = "holding";
                        trace.holdTimer = 60 + Math.random() * 60;
                    }
                } else if (trace.state === "holding") {
                    trace.holdTimer -= 1;
                    if (trace.holdTimer <= 0) {
                        trace.state = "fading";
                    }
                } else if (trace.state === "fading") {
                    trace.fadeOpacity -= 0.02;
                    if (trace.fadeOpacity <= 0) {
                        traces[i] = buildTrace(width, height);
                        return;
                    }
                }

                // INCREASED OPACITY: Base opacity bumped from 0.35 to 0.75
                const opacity =
                    trace.state === "fading" ? trace.fadeOpacity * 0.75 : 0.75;

                // Draw the completed portion of the path
                // INCREASED LIGHTNESS: Bumped from 0.72 to 0.85
                ctx.strokeStyle = `oklch(0.85 0.20 290 / ${opacity})`;
                ctx.lineWidth = 1.5; // INCREASED WIDTH: Bumped from 1 to 1.5 for better visibility
                ctx.beginPath();
                let covered = 0;
                const target = trace.totalLength * trace.progress;
                for (let s = 0; s < trace.segmentLengths.length; s++) {
                    const segLen = trace.segmentLengths[s];
                    const a = trace.points[s];
                    const b = trace.points[s + 1];
                    if (covered + segLen <= target) {
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                    } else if (covered < target) {
                        const segT = (target - covered) / segLen;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(a.x + (b.x - a.x) * segT, a.y + (b.y - a.y) * segT);
                    }
                    covered += segLen;
                }
                ctx.stroke();

                // Origin pad
                ctx.fillStyle = `oklch(0.85 0.20 290 / ${Math.min(1, opacity * 1.4)})`;
                ctx.beginPath();
                ctx.arc(trace.points[0].x, trace.points[0].y, 2.5, 0, Math.PI * 2); // INCREASED SIZE
                ctx.fill();

                // Lead point (the "plotter head") while actively drawing
                if (trace.state === "drawing") {
                    const head = pointAtProgress(trace, trace.progress);
                    // INCREASED LIGHTNESS & OPACITY: Pure bright violet/pink (Lightness 0.95, Opacity 1)
                    ctx.fillStyle = `oklch(0.95 0.20 290 / 1)`;
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 3, 0, Math.PI * 2); // INCREASED SIZE
                    ctx.fill();
                }
            });

            // ── Rare drafting caliper mark ──
            if (Math.random() < 0.004) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = 6 + Math.random() * 10;
                // INCREASED OPACITY & LIGHTNESS for the random crosshairs
                ctx.strokeStyle = "oklch(0.85 0.20 290 / 0.25)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.moveTo(x - size * 1.4, y);
                ctx.lineTo(x + size * 1.4, y);
                ctx.moveTo(x, y - size * 1.4);
                ctx.lineTo(x, y + size * 1.4);
                ctx.stroke();
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full pointer-events-none"
            style={{ opacity: 0.25 }} // INCREASED OPACITY: Bumped from 0.7 to 1
        />
    );
}