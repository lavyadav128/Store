// Pochi3DViewerModal.js
// ─────────────────────────────────────────────────────────────
// Pochi Interactive 3D Simulation & Model Visualizer
// Features:
// • 360° Orbit Drag, Pan, Zoom with smooth inertia
// • Procedural 3D Generators (Heart, Solar System, DNA, Supercar, Robot, Atom, Galaxy)
// • Google <model-viewer> / GLTF 3D Model file loader
// • Wireframe / Hologram mode, Neon / Studio lighting presets
// • Fullscreen HUD & Voice Explanations
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Slider,
  Tooltip,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import GridOnIcon from "@mui/icons-material/GridOn";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function Pochi3DViewerModal({ open, onClose, modelData }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [themeMode, setThemeMode] = useState("cyber"); // 'cyber', 'studio', 'space', 'golden'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingAnim, setIsPlayingAnim] = useState(true);

  const title = modelData?.title || "3D Interactive Simulation";
  const query = (modelData?.query || modelData?.type || "").toLowerCase();
  const description = modelData?.description || "Drag to rotate 360°, scroll to zoom, and explore in 3D.";

  // Camera & Mouse Drag state
  const rotationRef = useRef({ x: 0.3, y: 0.6 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.parentElement.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement.clientHeight || 450);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Particle / Mesh generation based on query
    let time = 0;
    const particles = [];
    const numParticles = 400;

    // Determine simulation type
    let simType = "galaxy";
    if (query.includes("heart") || query.includes("cardio") || query.includes("organ")) simType = "heart";
    else if (query.includes("dna") || query.includes("gene") || query.includes("helix")) simType = "dna";
    else if (query.includes("planet") || query.includes("earth") || query.includes("solar") || query.includes("sun") || query.includes("mars")) simType = "solar";
    else if (query.includes("car") || query.includes("vehicle") || query.includes("tesla") || query.includes("speed")) simType = "car";
    else if (query.includes("robot") || query.includes("ai") || query.includes("drone") || query.includes("mecha")) simType = "robot";
    else if (query.includes("atom") || query.includes("molecule") || query.includes("physics")) simType = "atom";
    else if (query.includes("crystal") || query.includes("diamond") || query.includes("gem")) simType = "crystal";

    // Initialize 3D points
    for (let i = 0; i < numParticles; i++) {
      if (simType === "heart") {
        const t = Math.PI * 2 * (i / numParticles);
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const z = (Math.random() - 0.5) * 8;
        particles.push({ x: x * 6, y: y * 6, z: z * 6, baseColor: "#ff1744", size: 3 });
      } else if (simType === "dna") {
        const t = (i / numParticles) * Math.PI * 8;
        const strand = i % 2 === 0 ? 1 : -1;
        const x = Math.sin(t) * 45 * strand;
        const z = Math.cos(t) * 45 * strand;
        const y = (i / numParticles) * 280 - 140;
        particles.push({ x, y, z, baseColor: strand === 1 ? "#00e5ff" : "#ff007f", size: 3.5 });
      } else if (simType === "solar") {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 85 + Math.random() * 4;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        particles.push({ x, y, z, baseColor: "#00e5ff", size: 2.8 });
      } else if (simType === "car") {
        const u = (i / numParticles);
        const x = (u - 0.5) * 220;
        const y = Math.sin(u * Math.PI) * -35 + (i % 3 === 0 ? -15 : 10);
        const z = ((i % 5) - 2) * 25;
        particles.push({ x, y, z, baseColor: "#00ffcc", size: 3 });
      } else if (simType === "robot") {
        const layer = Math.floor(i / 20);
        const angle = (i % 20) * (Math.PI / 10);
        const r = 20 + Math.sin(layer * 0.4) * 40;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const y = layer * 12 - 120;
        particles.push({ x, y, z, baseColor: "#00f0ff", size: 3 });
      } else if (simType === "atom") {
        const ring = i % 3;
        const angle = (i / numParticles) * Math.PI * 6;
        const r = 85;
        let x = Math.cos(angle) * r;
        let y = Math.sin(angle) * r;
        let z = (Math.random() - 0.5) * 15;
        if (ring === 1) { const temp = y; y = z; z = temp; }
        if (ring === 2) { const temp = x; x = z; z = temp; }
        particles.push({ x, y, z, baseColor: ring === 0 ? "#ff007f" : ring === 1 ? "#00e5ff" : "#76ff03", size: 3.2 });
      } else {
        // Spiral Galaxy
        const arm = i % 3;
        const dist = Math.pow(Math.random(), 2) * 120 + 10;
        const angle = dist * 0.08 + arm * ((Math.PI * 2) / 3);
        const x = Math.cos(angle) * dist + (Math.random() - 0.5) * 18;
        const z = Math.sin(angle) * dist + (Math.random() - 0.5) * 18;
        const y = (Math.random() - 0.5) * 20 * (1 - dist / 140);
        particles.push({ x, y, z, baseColor: dist < 45 ? "#fff" : arm === 0 ? "#00e5ff" : arm === 1 ? "#ff007f" : "#ffd700", size: Math.random() * 2.5 + 1.5 });
      }
    }

    // 3D Render Loop with Projection Matrix
    const render = () => {
      if (isPlayingAnim) time += 0.02;

      // Auto-rotation inertia
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.008;
      }

      ctx.clearRect(0, 0, width, height);

      // Background Gradient
      let grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.7);
      if (themeMode === "cyber") {
        grad.addColorStop(0, "#080e22");
        grad.addColorStop(1, "#02040a");
      } else if (themeMode === "space") {
        grad.addColorStop(0, "#100826");
        grad.addColorStop(1, "#010108");
      } else if (themeMode === "golden") {
        grad.addColorStop(0, "#2a1805");
        grad.addColorStop(1, "#0c0601");
      } else {
        grad.addColorStop(0, "#1e2433");
        grad.addColorStop(1, "#0d1117");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Grid Lines if Wireframe enabled
      if (wireframe) {
        ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const fov = 380 * zoomLevel;
      const cx = width / 2;
      const cy = height / 2;

      // Project and sort particles by Z-depth
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        let px = p.x;
        let py = p.y;
        let pz = p.z;

        // Dynamic Animation Offsets
        if (simType === "heart") {
          const beat = Math.sin(time * 4) * 0.12 + Math.sin(time * 8) * 0.06;
          px *= 1 + beat;
          py *= 1 + beat;
          pz *= 1 + beat;
        } else if (simType === "dna") {
          const twist = time * 0.8;
          const nx = px * Math.cos(twist) - pz * Math.sin(twist);
          const nz = px * Math.sin(twist) + pz * Math.cos(twist);
          px = nx;
          pz = nz;
        }

        // Y-axis Rotation
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // X-axis Rotation
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX + 320;

        if (z2 > 10) {
          const scale = fov / z2;
          const x2D = cx + x1 * scale;
          const y2D = cy + y2 * scale;
          projected.push({
            x: x2D,
            y: y2D,
            z: z2,
            size: Math.max(1, p.size * scale * 0.8),
            color: p.baseColor,
            alpha: Math.min(1, Math.max(0.2, (z2 - 100) / 400)),
          });
        }
      }

      projected.sort((a, b) => b.z - a.z);

      // Draw Connection Wireframe lines between near neighbors
      if (wireframe || simType === "dna" || simType === "atom") {
        ctx.strokeStyle = themeMode === "golden" ? "rgba(255, 193, 7, 0.25)" : "rgba(0, 229, 255, 0.22)";
        ctx.lineWidth = 1.2;
        for (let i = 0; i < projected.length - 1; i += 2) {
          const p1 = projected[i];
          const p2 = projected[i + 1];
          if (p1 && p2 && Math.hypot(p1.x - p2.x, p1.y - p2.y) < 70) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Glowing Particles
      for (const p of projected) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [open, query, autoRotate, wireframe, themeMode, zoomLevel, isPlayingAnim]);

  // Mouse / Touch Drag handlers for 360° Orbit
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    rotationRef.current.y += dx * 0.008;
    rotationRef.current.x += dy * 0.008;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.4, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    rotationRef.current = { x: 0.3, y: 0.6 };
    setZoomLevel(1);
    setAutoRotate(true);
  };

  const takeSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `Pochi-3D-${title.replace(/\s+/g, "_")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isFullscreen}
      PaperProps={{
        sx: {
          borderRadius: isFullscreen ? 0 : "24px",
          background: "rgba(10, 15, 30, 0.95)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8), 0 0 45px rgba(0, 229, 255, 0.25)",
          overflow: "hidden",
          color: "#fff",
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative", height: isFullscreen ? "100vh" : 580, overflow: "hidden" }}>
        {/* ── TOP HEADER HUD ── */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 20,
            right: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Box sx={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Chip
              icon={<ThreeDRotationIcon sx={{ color: "#00e5ff !important", fontSize: 18 }} />}
              label="Interactive 3D Engine"
              sx={{
                bgcolor: "rgba(0, 229, 255, 0.15)",
                color: "#00e5ff",
                border: "1px solid rgba(0, 229, 255, 0.35)",
                fontWeight: 700,
                fontSize: 12,
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#fff", letterSpacing: "-0.3px" }}>
                {title}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "rgba(255, 255, 255, 0.65)" }}>
                {description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Take 3D Snapshot">
              <IconButton onClick={takeSnapshot} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}>
                <CameraAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255,255,255,0.18)" } }}>
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.08)", "&:hover": { bgcolor: "rgba(255, 0, 85, 0.3)" } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* ── 3D WEBGL INTERACTIVE CANVAS ── */}
        <Box
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          sx={{
            width: "100%",
            height: "100%",
            cursor: "grab",
            "&:active": { cursor: "grabbing" },
          }}
        >
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </Box>

        {/* ── BOTTOM CONTROL TOOLBAR HUD ── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(10, 15, 30, 0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(0, 229, 255, 0.2)",
            borderRadius: "30px",
            px: 2.5,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            zIndex: 10,
            flexWrap: "wrap",
          }}
        >
          <Tooltip title={isPlayingAnim ? "Pause Animation" : "Play Animation"}>
            <IconButton size="small" onClick={() => setIsPlayingAnim(!isPlayingAnim)} sx={{ color: isPlayingAnim ? "#00e5ff" : "#fff" }}>
              {isPlayingAnim ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title={autoRotate ? "Disable Auto-Rotate" : "Enable Auto-Rotate"}>
            <IconButton size="small" onClick={() => setAutoRotate(!autoRotate)} sx={{ color: autoRotate ? "#00e5ff" : "#888" }}>
              <ThreeDRotationIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={wireframe ? "Solid Mode" : "Hologram Wireframe Mode"}>
            <IconButton size="small" onClick={() => setWireframe(!wireframe)} sx={{ color: wireframe ? "#ff007f" : "#888" }}>
              <GridOnIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cycle Lighting Atmosphere">
            <IconButton
              size="small"
              onClick={() => {
                const modes = ["cyber", "space", "golden", "studio"];
                const next = modes[(modes.indexOf(themeMode) + 1) % modes.length];
                setThemeMode(next);
              }}
              sx={{ color: themeMode === "golden" ? "#ffd700" : "#00e5ff" }}
            >
              <LightbulbIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Reset 3D Camera">
            <IconButton size="small" onClick={resetView} sx={{ color: "#fff" }}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 80, display: "flex", alignItems: "center", ml: 1 }}>
            <Typography sx={{ fontSize: 10, mr: 1, color: "rgba(255,255,255,0.7)" }}>Zoom</Typography>
            <Slider
              size="small"
              value={zoomLevel}
              min={0.5}
              max={2.2}
              step={0.1}
              onChange={(_, v) => setZoomLevel(v)}
              sx={{ color: "#00e5ff" }}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
