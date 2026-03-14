(() => {
	const BADGE_IMAGE_STORAGE_KEY = "thisqrworks-custom-badge-image";

	const qrInput = document.getElementById("qr-input");
	const statusNote = document.getElementById("status-note");
	const qrPreview = document.getElementById("qr-preview");
	const downloadActions = document.getElementById("download-actions");
	const downloadSvgBtn = document.getElementById("download-svg");
	const downloadPngBtn = document.getElementById("download-png");
	const generateBtn = document.getElementById("generate-btn");
	const resetBtn = document.getElementById("reset-btn");
	const randomizeBtn = document.getElementById("randomize-btn");
	const presetStyle = document.getElementById("preset-style");
	const pngCanvas = document.getElementById("png-canvas");

	const controls = {
		liveUpdate: document.getElementById("live-update"),
		invertModules: document.getElementById("invert-modules"),
		cellSize: document.getElementById("cell-size"),
		quietZone: document.getElementById("quiet-zone"),
		moduleScale: document.getElementById("module-scale"),
		moduleRoundness: document.getElementById("module-roundness"),
		errorLevel: document.getElementById("error-level"),
		moduleStyle: document.getElementById("module-style"),
		fgColor: document.getElementById("fg-color"),
		fgHex: document.getElementById("fg-hex"),
		bgColor: document.getElementById("bg-color"),
		bgHex: document.getElementById("bg-hex"),
		transparentBg: document.getElementById("transparent-bg"),
		useGradient: document.getElementById("use-gradient"),
		gradientEyes: document.getElementById("gradient-eyes"),
		gradStart: document.getElementById("grad-start"),
		gradStartHex: document.getElementById("grad-start-hex"),
		gradEnd: document.getElementById("grad-end"),
		gradEndHex: document.getElementById("grad-end-hex"),
		gradientType: document.getElementById("gradient-type"),
		gradientAngle: document.getElementById("gradient-angle"),
		eyeOuterStyle: document.getElementById("eye-outer-style"),
		eyeInnerStyle: document.getElementById("eye-inner-style"),
		eyeOuterColor: document.getElementById("eye-outer-color"),
		eyeOuterHex: document.getElementById("eye-outer-hex"),
		eyeInnerColor: document.getElementById("eye-inner-color"),
		eyeInnerHex: document.getElementById("eye-inner-hex"),
		frameStyle: document.getElementById("frame-style"),
		framePadding: document.getElementById("frame-padding"),
		frameRadius: document.getElementById("frame-radius"),
		frameColor: document.getElementById("frame-color"),
		frameHex: document.getElementById("frame-hex"),
		badgeShape: document.getElementById("badge-shape"),
		badgeSize: document.getElementById("badge-size"),
		badgeBg: document.getElementById("badge-bg"),
		badgeBgHex: document.getElementById("badge-bg-hex"),
		badgeImageFit: document.getElementById("badge-image-fit"),
		badgeKnockout: document.getElementById("badge-knockout"),
		badgeImage: document.getElementById("badge-image"),
		badgeImageClear: document.getElementById("badge-image-clear"),
		showCaption: document.getElementById("show-caption"),
		captionText: document.getElementById("caption-text"),
		captionSize: document.getElementById("caption-size"),
		captionColor: document.getElementById("caption-color"),
		captionHex: document.getElementById("caption-hex"),
		useShadow: document.getElementById("use-shadow"),
		shadowBlur: document.getElementById("shadow-blur"),
		shadowOffset: document.getElementById("shadow-offset"),
		shadowColor: document.getElementById("shadow-color"),
		shadowHex: document.getElementById("shadow-hex"),
		pngSize: document.getElementById("png-size"),
		fileName: document.getElementById("file-name"),
	};

	const labels = {
		cellSize: document.getElementById("cell-size-label"),
		quietZone: document.getElementById("quiet-zone-label"),
		moduleScale: document.getElementById("module-scale-label"),
		moduleRoundness: document.getElementById("module-roundness-label"),
		gradientAngle: document.getElementById("gradient-angle-label"),
		framePadding: document.getElementById("frame-padding-label"),
		frameRadius: document.getElementById("frame-radius-label"),
		badgeSize: document.getElementById("badge-size-label"),
		captionSize: document.getElementById("caption-size-label"),
		shadowBlur: document.getElementById("shadow-blur-label"),
		shadowOffset: document.getElementById("shadow-offset-label"),
	};

	const gradientControls = document.getElementById("gradient-controls");
	const shadowControls = document.getElementById("shadow-controls");
	const captionControls = document.getElementById("caption-controls");
	const badgeImagePreview = document.getElementById("badge-image-preview");
	const badgeImageMeta = document.getElementById("badge-image-meta");

	let lastSvgMarkup = "";
	let lastObjectUrl = null;
	let badgeImageDataUrl = "";
	let badgeImageName = "";

	const DEFAULTS = {
		liveUpdate: true,
		invertModules: false,
		cellSize: 8,
		quietZone: 4,
		moduleScale: 1,
		moduleRoundness: 0.3,
		errorLevel: "M",
		moduleStyle: "rounded",
		fg: "#101828",
		bg: "#f8fafc",
		transparentBg: false,
		useGradient: false,
		gradientEyes: false,
		gradStart: "#0f172a",
		gradEnd: "#0ea5e9",
		gradientType: "linear",
		gradientAngle: 45,
		eyeOuterStyle: "rounded",
		eyeInnerStyle: "circle",
		eyeOuterColor: "#0f172a",
		eyeInnerColor: "#0ea5e9",
		frameStyle: "none",
		framePadding: 2,
		frameRadius: 20,
		frameColor: "#e2e8f0",
		badgeShape: "rounded",
		badgeSize: 24,
		badgeBg: "#ffffff",
		badgeImageFit: "cover",
		badgeKnockout: true,
		showCaption: false,
		captionText: "",
		captionSize: 20,
		captionColor: "#0f172a",
		useShadow: false,
		shadowBlur: 10,
		shadowOffset: 6,
		shadowColor: "#475569",
		pngSize: "512",
		fileName: "thisqrworks-custom",
	};

	const COLOR_PAIRS = [
		[controls.fgColor, controls.fgHex],
		[controls.bgColor, controls.bgHex],
		[controls.gradStart, controls.gradStartHex],
		[controls.gradEnd, controls.gradEndHex],
		[controls.eyeOuterColor, controls.eyeOuterHex],
		[controls.eyeInnerColor, controls.eyeInnerHex],
		[controls.frameColor, controls.frameHex],
		[controls.badgeBg, controls.badgeBgHex],
		[controls.captionColor, controls.captionHex],
		[controls.shadowColor, controls.shadowHex],
	];

	const PRESETS = {
		classic: {
			moduleStyle: "square",
			moduleScale: 1,
			moduleRoundness: 0,
			fg: "#000000",
			bg: "#ffffff",
			transparentBg: false,
			useGradient: false,
			eyeOuterStyle: "square",
			eyeInnerStyle: "square",
			eyeOuterColor: "#000000",
			eyeInnerColor: "#000000",
			frameStyle: "none",
			useShadow: false,
			showCaption: false,
		},
		neo: {
			moduleStyle: "rounded",
			moduleScale: 0.92,
			moduleRoundness: 0.42,
			fg: "#0f172a",
			bg: "#eff6ff",
			useGradient: true,
			gradStart: "#0f172a",
			gradEnd: "#06b6d4",
			gradientType: "linear",
			gradientAngle: 35,
			gradientEyes: true,
			eyeOuterStyle: "rounded",
			eyeInnerStyle: "circle",
			frameStyle: "soft",
			framePadding: 3,
			frameColor: "#dbeafe",
			useShadow: true,
		},
		soft: {
			moduleStyle: "dot",
			moduleScale: 0.86,
			moduleRoundness: 0.5,
			fg: "#1d4ed8",
			bg: "#f8fafc",
			useGradient: true,
			gradStart: "#1d4ed8",
			gradEnd: "#22d3ee",
			gradientType: "radial",
			gradientEyes: true,
			eyeOuterStyle: "circle",
			eyeInnerStyle: "circle",
			frameStyle: "solid",
			frameColor: "#dbeafe",
			useShadow: true,
		},
		midnight: {
			moduleStyle: "soft",
			moduleScale: 0.94,
			moduleRoundness: 0.45,
			fg: "#e2e8f0",
			bg: "#0f172a",
			useGradient: true,
			gradStart: "#f8fafc",
			gradEnd: "#60a5fa",
			gradientType: "linear",
			gradientAngle: 130,
			eyeOuterStyle: "rounded",
			eyeInnerStyle: "rounded",
			eyeOuterColor: "#e2e8f0",
			eyeInnerColor: "#93c5fd",
			frameStyle: "double",
			frameColor: "#1e293b",
			useShadow: true,
			shadowColor: "#000000",
		},
		sunrise: {
			moduleStyle: "diamond",
			moduleScale: 0.88,
			moduleRoundness: 0.12,
			fg: "#7c2d12",
			bg: "#fff7ed",
			useGradient: true,
			gradStart: "#ea580c",
			gradEnd: "#facc15",
			gradientType: "linear",
			gradientAngle: 20,
			gradientEyes: true,
			eyeOuterStyle: "rounded",
			eyeInnerStyle: "circle",
			eyeOuterColor: "#c2410c",
			eyeInnerColor: "#fb923c",
			frameStyle: "soft",
			frameColor: "#fed7aa",
			useShadow: true,
			shadowColor: "#fdba74",
		},
	};

	function getIncomingData() {
		const params = new URLSearchParams(window.location.search);
		const data = params.get("data");
		return data ? data.trim() : "";
	}

	function setStatus(msg) {
		statusNote.textContent = msg;
	}

	function safeFilename(name) {
		const raw = String(name || "").trim();
		const cleaned = raw
			.replace(/[^a-zA-Z0-9-_]+/g, "-")
			.replace(/-{2,}/g, "-")
			.replace(/^-+|-+$/g, "");
		return cleaned || DEFAULTS.fileName;
	}

	function isValidHex(value) {
		return /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
	}

	function escapeXml(text) {
		return String(text || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}

	function pairColorControls(colorInput, hexInput) {
		colorInput.addEventListener("input", () => {
			hexInput.value = colorInput.value;
			maybeAutoGenerate();
		});
		hexInput.addEventListener("input", () => {
			if (isValidHex(hexInput.value)) {
				colorInput.value = hexInput.value;
				maybeAutoGenerate();
			}
		});
	}

	function setLabelValue(labelKey, valueText) {
		if (labels[labelKey]) labels[labelKey].textContent = valueText;
	}

	function syncLabels() {
		setLabelValue("cellSize", controls.cellSize.value);
		setLabelValue("quietZone", controls.quietZone.value);
		setLabelValue("moduleScale", Number(controls.moduleScale.value).toFixed(2));
		setLabelValue(
			"moduleRoundness",
			Number(controls.moduleRoundness.value).toFixed(2),
		);
		setLabelValue("gradientAngle", controls.gradientAngle.value);
		setLabelValue("framePadding", controls.framePadding.value);
		setLabelValue("frameRadius", controls.frameRadius.value);
		setLabelValue("badgeSize", controls.badgeSize.value);
		setLabelValue("captionSize", controls.captionSize.value);
		setLabelValue("shadowBlur", controls.shadowBlur.value);
		setLabelValue("shadowOffset", controls.shadowOffset.value);
	}

	function updateControlVisibility() {
		gradientControls.classList.toggle(
			"disabled-controls",
			!controls.useGradient.checked,
		);
		shadowControls.classList.toggle(
			"disabled-controls",
			!controls.useShadow.checked,
		);
		captionControls.classList.toggle(
			"disabled-controls",
			!controls.showCaption.checked,
		);
	}

	function updateBadgePreview() {
		if (badgeImageDataUrl) {
			badgeImagePreview.src = badgeImageDataUrl;
			badgeImagePreview.hidden = false;
			badgeImageMeta.textContent = badgeImageName || "Badge image loaded.";
		} else {
			badgeImagePreview.removeAttribute("src");
			badgeImagePreview.hidden = true;
			badgeImageMeta.textContent = "No image selected.";
		}
	}

	function saveBadgeImageToStorage() {
		try {
			if (!badgeImageDataUrl) {
				localStorage.removeItem(BADGE_IMAGE_STORAGE_KEY);
				return;
			}
			localStorage.setItem(
				BADGE_IMAGE_STORAGE_KEY,
				JSON.stringify({
					dataUrl: badgeImageDataUrl,
					name: badgeImageName || "",
				}),
			);
		} catch (_) {
			// Ignore storage failures (quota/private mode).
		}
	}

	function restoreBadgeImageFromStorage() {
		try {
			const raw = localStorage.getItem(BADGE_IMAGE_STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (
				parsed &&
				typeof parsed.dataUrl === "string" &&
				parsed.dataUrl.startsWith("data:image/")
			) {
				badgeImageDataUrl = parsed.dataUrl;
				badgeImageName = parsed.name || "Stored badge image";
				updateBadgePreview();
			}
		} catch (_) {
			// Ignore malformed storage.
		}
	}

	function clearBadgeImage(persist = true) {
		badgeImageDataUrl = "";
		badgeImageName = "";
		controls.badgeImage.value = "";
		updateBadgePreview();
		if (persist) saveBadgeImageToStorage();
		maybeAutoGenerate();
	}

	function handleBadgeImageUpload(file) {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setStatus("Please upload an image file for center badge.");
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = String(reader.result || "");
			if (!dataUrl.startsWith("data:image/")) {
				setStatus("Could not read image. Try a different file.");
				return;
			}
			badgeImageDataUrl = dataUrl;
			badgeImageName = file.name;
			updateBadgePreview();
			saveBadgeImageToStorage();
			maybeAutoGenerate();
		};
		reader.onerror = () => setStatus("Could not read image.");
		reader.readAsDataURL(file);
	}

	function buildMatrix(qr) {
		const count = qr.getModuleCount();
		const matrix = Array.from({ length: count }, (_, r) =>
			Array.from({ length: count }, (_, c) => qr.isDark(r, c)),
		);
		return { matrix, count };
	}

	function isFinderCell(r, c, count) {
		const inTopLeft = r >= 0 && r < 7 && c >= 0 && c < 7;
		const inTopRight = r >= 0 && r < 7 && c >= count - 7 && c < count;
		const inBottomLeft = r >= count - 7 && r < count && c >= 0 && c < 7;
		return inTopLeft || inTopRight || inBottomLeft;
	}

	function svgRect(x, y, w, h, rx, fill, opacity = 1) {
		const radius = Math.max(0, Number(rx) || 0);
		return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" ry="${radius}" fill="${fill}" fill-opacity="${opacity}"/>`;
	}

	function svgCircle(cx, cy, r, fill, opacity = 1) {
		return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="${opacity}"/>`;
	}

	function drawModuleShape(style, x, y, size, roundness, fill) {
		if (style === "dot") {
			const r = size / 2;
			return svgCircle(x + r, y + r, r, fill);
		}
		if (style === "diamond") {
			const x2 = x + size;
			const y2 = y + size;
			const cx = x + size / 2;
			const cy = y + size / 2;
			return `<path d="M ${cx} ${y} L ${x2} ${cy} L ${cx} ${y2} L ${x} ${cy} Z" fill="${fill}"/>`;
		}
		if (style === "soft") {
			return svgRect(
				x,
				y,
				size,
				size,
				size * Math.min(0.49, roundness + 0.16),
				fill,
				0.94,
			);
		}
		if (style === "rounded") {
			return svgRect(x, y, size, size, size * roundness, fill);
		}
		return svgRect(x, y, size, size, 0, fill);
	}

	function drawEyeShape(style, x, y, size, fill) {
		if (style === "circle") {
			return svgCircle(x + size / 2, y + size / 2, size / 2, fill);
		}
		if (style === "rounded") {
			return svgRect(x, y, size, size, size * 0.26, fill);
		}
		return svgRect(x, y, size, size, 0, fill);
	}

	function buildGradientDef(config, qrBox) {
		const angleRad = (Number(config.gradientAngle) * Math.PI) / 180;
		const cos = Math.cos(angleRad);
		const sin = Math.sin(angleRad);
		const x1 = 50 - cos * 50;
		const y1 = 50 - sin * 50;
		const x2 = 50 + cos * 50;
		const y2 = 50 + sin * 50;

		if (config.gradientType === "radial") {
			return `<radialGradient id="qr-grad" cx="50%" cy="50%" r="75%"><stop offset="0%" stop-color="${config.gradStart}"/><stop offset="100%" stop-color="${config.gradEnd}"/></radialGradient>`;
		}

		return `<linearGradient id="qr-grad" gradientUnits="userSpaceOnUse" x1="${qrBox.x + (x1 / 100) * qrBox.size}" y1="${qrBox.y + (y1 / 100) * qrBox.size}" x2="${qrBox.x + (x2 / 100) * qrBox.size}" y2="${qrBox.y + (y2 / 100) * qrBox.size}"><stop offset="0%" stop-color="${config.gradStart}"/><stop offset="100%" stop-color="${config.gradEnd}"/></linearGradient>`;
	}

	function getConfig() {
		return {
			text: qrInput.value.trim(),
			liveUpdate: controls.liveUpdate.checked,
			invertModules: controls.invertModules.checked,
			cellSize: Number(controls.cellSize.value) || DEFAULTS.cellSize,
			quietZone: Number(controls.quietZone.value) || DEFAULTS.quietZone,
			moduleScale: Number(controls.moduleScale.value) || DEFAULTS.moduleScale,
			moduleRoundness:
				Number(controls.moduleRoundness.value) || DEFAULTS.moduleRoundness,
			errorLevel: controls.errorLevel.value || DEFAULTS.errorLevel,
			moduleStyle: controls.moduleStyle.value || DEFAULTS.moduleStyle,
			fg: isValidHex(controls.fgHex.value) ? controls.fgHex.value : DEFAULTS.fg,
			bg: isValidHex(controls.bgHex.value) ? controls.bgHex.value : DEFAULTS.bg,
			transparentBg: controls.transparentBg.checked,
			useGradient: controls.useGradient.checked,
			gradientEyes: controls.gradientEyes.checked,
			gradStart: isValidHex(controls.gradStartHex.value)
				? controls.gradStartHex.value
				: DEFAULTS.gradStart,
			gradEnd: isValidHex(controls.gradEndHex.value)
				? controls.gradEndHex.value
				: DEFAULTS.gradEnd,
			gradientType: controls.gradientType.value,
			gradientAngle:
				Number(controls.gradientAngle.value) || DEFAULTS.gradientAngle,
			eyeOuterStyle: controls.eyeOuterStyle.value || DEFAULTS.eyeOuterStyle,
			eyeInnerStyle: controls.eyeInnerStyle.value || DEFAULTS.eyeInnerStyle,
			eyeOuterColor: isValidHex(controls.eyeOuterHex.value)
				? controls.eyeOuterHex.value
				: DEFAULTS.eyeOuterColor,
			eyeInnerColor: isValidHex(controls.eyeInnerHex.value)
				? controls.eyeInnerHex.value
				: DEFAULTS.eyeInnerColor,
			frameStyle: controls.frameStyle.value || DEFAULTS.frameStyle,
			framePadding:
				Number(controls.framePadding.value) || DEFAULTS.framePadding,
			frameRadius: Number(controls.frameRadius.value) || DEFAULTS.frameRadius,
			frameColor: isValidHex(controls.frameHex.value)
				? controls.frameHex.value
				: DEFAULTS.frameColor,
			badgeShape: controls.badgeShape.value || DEFAULTS.badgeShape,
			badgeSize: Number(controls.badgeSize.value) || DEFAULTS.badgeSize,
			badgeBg: isValidHex(controls.badgeBgHex.value)
				? controls.badgeBgHex.value
				: DEFAULTS.badgeBg,
			badgeImageFit: controls.badgeImageFit.value || DEFAULTS.badgeImageFit,
			badgeKnockout: controls.badgeKnockout.checked,
			badgeImageDataUrl,
			showCaption: controls.showCaption.checked,
			captionText: String(controls.captionText.value || "").trim(),
			captionSize: Number(controls.captionSize.value) || DEFAULTS.captionSize,
			captionColor: isValidHex(controls.captionHex.value)
				? controls.captionHex.value
				: DEFAULTS.captionColor,
			useShadow: controls.useShadow.checked,
			shadowBlur: Number(controls.shadowBlur.value) || DEFAULTS.shadowBlur,
			shadowOffset:
				Number(controls.shadowOffset.value) || DEFAULTS.shadowOffset,
			shadowColor: isValidHex(controls.shadowHex.value)
				? controls.shadowHex.value
				: DEFAULTS.shadowColor,
			pngSize: Number(controls.pngSize.value) || 512,
			fileName: safeFilename(controls.fileName.value),
		};
	}

	function renderSvg(qr, config) {
		const { matrix, count } = buildMatrix(qr);
		const cell = config.cellSize;
		const quietPx = config.quietZone * cell;
		const framePadPx = config.framePadding * cell;
		const qrPixelSize = count * cell + quietPx * 2;
		const baseSize = qrPixelSize + framePadPx * 2;
		const qrOffset = framePadPx;
		const matrixOffset = qrOffset + quietPx;
		const moduleSize = Math.max(0.2, cell * config.moduleScale);
		const inset = (cell - moduleSize) / 2;
		const fillId = config.useGradient ? "url(#qr-grad)" : config.fg;
		const eyeFill =
			config.useGradient && config.gradientEyes
				? "url(#qr-grad)"
				: config.eyeOuterColor;
		const eyeCenterFill =
			config.useGradient && config.gradientEyes
				? "url(#qr-grad)"
				: config.eyeInnerColor;
		const quietColor = config.transparentBg ? "#ffffff" : config.bg;
		const hasBadgeImage = Boolean(config.badgeImageDataUrl);
		const hasCaption = config.showCaption && config.captionText;

		const captionGap = hasCaption ? Math.max(10, cell * 1.2) : 0;
		const captionArea = hasCaption
			? Math.max(config.captionSize * 1.75, cell * 4)
			: 0;
		const totalHeight = baseSize + captionGap + captionArea;

		let badgeZone = null;
		if (hasBadgeImage) {
			const zoneModules = Math.max(
				5,
				Math.floor((count * config.badgeSize) / 100),
			);
			const half = Math.floor(zoneModules / 2);
			const center = Math.floor(count / 2);
			badgeZone = {
				startR: center - half,
				endR: center + half,
				startC: center - half,
				endC: center + half,
			};
		}

		const defs = [];
		if (config.useGradient) {
			defs.push(
				buildGradientDef(config, {
					x: matrixOffset,
					y: matrixOffset,
					size: count * cell,
				}),
			);
		}
		if (config.useShadow) {
			defs.push(
				`<filter id="qr-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="${config.shadowOffset}" stdDeviation="${config.shadowBlur / 2}" flood-color="${config.shadowColor}" flood-opacity="0.45"/></filter>`,
			);
		}

		const frameParts = [];
		if (config.frameStyle !== "none") {
			const frameRect = {
				x: 0,
				y: 0,
				w: baseSize,
				h: baseSize,
				r: config.frameRadius,
			};
			if (config.frameStyle === "solid") {
				frameParts.push(
					svgRect(
						frameRect.x,
						frameRect.y,
						frameRect.w,
						frameRect.h,
						frameRect.r,
						config.frameColor,
					),
				);
			}
			if (config.frameStyle === "double") {
				frameParts.push(
					svgRect(
						frameRect.x,
						frameRect.y,
						frameRect.w,
						frameRect.h,
						frameRect.r,
						config.frameColor,
					),
				);
				frameParts.push(
					svgRect(
						frameRect.x + cell,
						frameRect.y + cell,
						frameRect.w - cell * 2,
						frameRect.h - cell * 2,
						Math.max(0, frameRect.r - cell),
						quietColor,
					),
				);
			}
			if (config.frameStyle === "soft") {
				frameParts.push(
					svgRect(
						frameRect.x,
						frameRect.y,
						frameRect.w,
						frameRect.h,
						frameRect.r,
						config.frameColor,
						0.85,
					),
				);
				frameParts.push(
					svgRect(
						frameRect.x + cell * 0.5,
						frameRect.y + cell * 0.5,
						frameRect.w - cell,
						frameRect.h - cell,
						Math.max(0, frameRect.r - cell),
						"#ffffff",
						0.25,
					),
				);
			}
		}

		const moduleParts = [];
		for (let r = 0; r < count; r += 1) {
			for (let c = 0; c < count; c += 1) {
				const baseDark = matrix[r][c];
				const isDark = config.invertModules ? !baseDark : baseDark;
				if (!isDark) continue;
				if (isFinderCell(r, c, count)) continue;
				if (
					badgeZone &&
					config.badgeKnockout &&
					r >= badgeZone.startR &&
					r <= badgeZone.endR &&
					c >= badgeZone.startC &&
					c <= badgeZone.endC
				) {
					continue;
				}
				const x = matrixOffset + c * cell + inset;
				const y = matrixOffset + r * cell + inset;
				moduleParts.push(
					drawModuleShape(
						config.moduleStyle,
						x,
						y,
						moduleSize,
						config.moduleRoundness,
						fillId,
					),
				);
			}
		}

		const eyeParts = [];
		[
			{ r: 0, c: 0 },
			{ r: 0, c: count - 7 },
			{ r: count - 7, c: 0 },
		].forEach((eye) => {
			const x = matrixOffset + eye.c * cell;
			const y = matrixOffset + eye.r * cell;
			const outerSize = 7 * cell;
			const holeSize = 5 * cell;
			const innerSize = 3 * cell;
			eyeParts.push(
				drawEyeShape(config.eyeOuterStyle, x, y, outerSize, eyeFill),
			);
			eyeParts.push(
				drawEyeShape(
					config.eyeOuterStyle,
					x + cell,
					y + cell,
					holeSize,
					quietColor,
				),
			);
			eyeParts.push(
				drawEyeShape(
					config.eyeInnerStyle,
					x + cell * 2,
					y + cell * 2,
					innerSize,
					eyeCenterFill,
				),
			);
		});

		const badgeParts = [];
		if (hasBadgeImage) {
			const badgeSizePx = (count * cell * config.badgeSize) / 100;
			const badgeX = matrixOffset + (count * cell - badgeSizePx) / 2;
			const badgeY = matrixOffset + (count * cell - badgeSizePx) / 2;
			const clipId = "badge-clip";

			if (config.badgeShape === "circle") {
				defs.push(
					`<clipPath id="${clipId}"><circle cx="${badgeX + badgeSizePx / 2}" cy="${badgeY + badgeSizePx / 2}" r="${badgeSizePx / 2}"/></clipPath>`,
				);
				badgeParts.push(
					svgCircle(
						badgeX + badgeSizePx / 2,
						badgeY + badgeSizePx / 2,
						badgeSizePx / 2,
						config.badgeBg,
					),
				);
			} else if (config.badgeShape === "square") {
				defs.push(
					`<clipPath id="${clipId}"><rect x="${badgeX}" y="${badgeY}" width="${badgeSizePx}" height="${badgeSizePx}"/></clipPath>`,
				);
				badgeParts.push(
					svgRect(badgeX, badgeY, badgeSizePx, badgeSizePx, 0, config.badgeBg),
				);
			} else {
				defs.push(
					`<clipPath id="${clipId}"><rect x="${badgeX}" y="${badgeY}" width="${badgeSizePx}" height="${badgeSizePx}" rx="${badgeSizePx * 0.2}" ry="${badgeSizePx * 0.2}"/></clipPath>`,
				);
				badgeParts.push(
					svgRect(
						badgeX,
						badgeY,
						badgeSizePx,
						badgeSizePx,
						badgeSizePx * 0.2,
						config.badgeBg,
					),
				);
			}

			const preserve =
				config.badgeImageFit === "contain" ? "xMidYMid meet" : "xMidYMid slice";
			badgeParts.push(
				`<image x="${badgeX}" y="${badgeY}" width="${badgeSizePx}" height="${badgeSizePx}" href="${config.badgeImageDataUrl}" preserveAspectRatio="${preserve}" clip-path="url(#${clipId})"/>`,
			);
		}

		const captionParts = [];
		if (hasCaption) {
			const captionY = baseSize + captionGap + captionArea * 0.68;
			const captionSafe = escapeXml(config.captionText.slice(0, 80));
			captionParts.push(
				`<text x="${baseSize / 2}" y="${captionY}" text-anchor="middle" font-family="'Trebuchet MS', 'Segoe UI', sans-serif" font-weight="600" font-size="${config.captionSize}" fill="${config.captionColor}">${captionSafe}</text>`,
			);
		}

		const backgroundRect = config.transparentBg
			? ""
			: svgRect(
					qrOffset,
					qrOffset,
					qrPixelSize,
					qrPixelSize,
					Math.max(0, config.frameRadius / 2),
					config.bg,
				);

		const defsBlock = defs.length ? `<defs>${defs.join("")}</defs>` : "";
		const groupFilterAttr = config.useShadow ? ' filter="url(#qr-shadow)"' : "";

		return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${baseSize} ${totalHeight}" role="img" aria-label="Custom generated QR code">${defsBlock}${frameParts.join("")}<g${groupFilterAttr}>${backgroundRect}${moduleParts.join("")}${eyeParts.join("")}${badgeParts.join("")}</g>${captionParts.join("")}</svg>`;
	}

	function generate() {
		const config = getConfig();

		if (!config.text) {
			qrPreview.innerHTML =
				'<p class="preview-placeholder">Preview will appear here.</p>';
			qrPreview.classList.remove("preview-tall");
			downloadActions.hidden = true;
			lastSvgMarkup = "";
			setStatus("Enter text to generate.");
			return;
		}

		try {
			const qr = qrcode(0, config.errorLevel);
			qr.addData(config.text);
			qr.make();

			lastSvgMarkup = renderSvg(qr, config);
			qrPreview.innerHTML = lastSvgMarkup;
			qrPreview.classList.toggle(
				"preview-tall",
				Boolean(config.showCaption && config.captionText),
			);

			if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = URL.createObjectURL(
				new Blob([lastSvgMarkup], { type: "image/svg+xml" }),
			);

			downloadActions.hidden = false;
			setStatus("");
		} catch (_error) {
			setStatus(
				"Data too long for current settings. Try shorter text or lower error correction.",
			);
			qrPreview.innerHTML =
				'<p class="preview-placeholder">Could not generate QR.</p>';
			qrPreview.classList.remove("preview-tall");
			downloadActions.hidden = true;
			lastSvgMarkup = "";
		}
	}

	function maybeAutoGenerate() {
		syncLabels();
		updateControlVisibility();
		if (controls.liveUpdate.checked) generate();
	}

	function applyPreset(name) {
		const preset = PRESETS[name];
		if (!preset) return;

		Object.entries(preset).forEach(([key, value]) => {
			switch (key) {
				case "moduleStyle":
					controls.moduleStyle.value = value;
					break;
				case "moduleScale":
					controls.moduleScale.value = value;
					break;
				case "moduleRoundness":
					controls.moduleRoundness.value = value;
					break;
				case "fg":
					controls.fgColor.value = value;
					controls.fgHex.value = value;
					break;
				case "bg":
					controls.bgColor.value = value;
					controls.bgHex.value = value;
					break;
				case "transparentBg":
					controls.transparentBg.checked = value;
					break;
				case "useGradient":
					controls.useGradient.checked = value;
					break;
				case "gradientEyes":
					controls.gradientEyes.checked = value;
					break;
				case "gradStart":
					controls.gradStart.value = value;
					controls.gradStartHex.value = value;
					break;
				case "gradEnd":
					controls.gradEnd.value = value;
					controls.gradEndHex.value = value;
					break;
				case "gradientType":
					controls.gradientType.value = value;
					break;
				case "gradientAngle":
					controls.gradientAngle.value = value;
					break;
				case "eyeOuterStyle":
					controls.eyeOuterStyle.value = value;
					break;
				case "eyeInnerStyle":
					controls.eyeInnerStyle.value = value;
					break;
				case "eyeOuterColor":
					controls.eyeOuterColor.value = value;
					controls.eyeOuterHex.value = value;
					break;
				case "eyeInnerColor":
					controls.eyeInnerColor.value = value;
					controls.eyeInnerHex.value = value;
					break;
				case "frameStyle":
					controls.frameStyle.value = value;
					break;
				case "framePadding":
					controls.framePadding.value = value;
					break;
				case "frameColor":
					controls.frameColor.value = value;
					controls.frameHex.value = value;
					break;
				case "showCaption":
					controls.showCaption.checked = value;
					break;
				case "useShadow":
					controls.useShadow.checked = value;
					break;
				case "shadowColor":
					controls.shadowColor.value = value;
					controls.shadowHex.value = value;
					break;
				default:
					break;
			}
		});

		maybeAutoGenerate();
	}

	function randomColor() {
		const val = Math.floor(Math.random() * 0xffffff);
		return `#${val.toString(16).padStart(6, "0")}`;
	}

	function randomizeDesign() {
		const moduleStyles = ["square", "rounded", "dot", "diamond", "soft"];
		const eyeStyles = ["square", "rounded", "circle"];
		const frameStyles = ["none", "solid", "double", "soft"];

		const fg = randomColor();
		const bg = randomColor();
		const gradA = randomColor();
		const gradB = randomColor();

		controls.moduleStyle.value =
			moduleStyles[Math.floor(Math.random() * moduleStyles.length)];
		controls.moduleScale.value = (0.72 + Math.random() * 0.28).toFixed(2);
		controls.moduleRoundness.value = (Math.random() * 0.5).toFixed(2);
		controls.fgColor.value = fg;
		controls.fgHex.value = fg;
		controls.bgColor.value = bg;
		controls.bgHex.value = bg;
		controls.useGradient.checked = Math.random() > 0.35;
		controls.gradientEyes.checked = Math.random() > 0.45;
		controls.gradStart.value = gradA;
		controls.gradStartHex.value = gradA;
		controls.gradEnd.value = gradB;
		controls.gradEndHex.value = gradB;
		controls.gradientType.value = Math.random() > 0.5 ? "linear" : "radial";
		controls.gradientAngle.value = String(Math.floor(Math.random() * 360));
		controls.eyeOuterStyle.value =
			eyeStyles[Math.floor(Math.random() * eyeStyles.length)];
		controls.eyeInnerStyle.value =
			eyeStyles[Math.floor(Math.random() * eyeStyles.length)];
		controls.eyeOuterColor.value = gradA;
		controls.eyeOuterHex.value = gradA;
		controls.eyeInnerColor.value = gradB;
		controls.eyeInnerHex.value = gradB;
		controls.frameStyle.value =
			frameStyles[Math.floor(Math.random() * frameStyles.length)];
		controls.framePadding.value = String(Math.floor(Math.random() * 5));
		controls.frameRadius.value = String(Math.floor(Math.random() * 60));
		controls.frameColor.value = randomColor();
		controls.frameHex.value = controls.frameColor.value;
		controls.badgeShape.value =
			eyeStyles[Math.floor(Math.random() * eyeStyles.length)];
		controls.badgeSize.value = String(16 + Math.floor(Math.random() * 16));
		controls.badgeBg.value = "#ffffff";
		controls.badgeBgHex.value = "#ffffff";
		controls.showCaption.checked = Math.random() > 0.7;
		controls.captionText.value = controls.showCaption.checked ? "Scan me" : "";
		controls.captionSize.value = String(16 + Math.floor(Math.random() * 14));
		controls.captionColor.value = "#0f172a";
		controls.captionHex.value = "#0f172a";
		controls.useShadow.checked = Math.random() > 0.5;
		controls.shadowBlur.value = String(4 + Math.floor(Math.random() * 22));
		controls.shadowOffset.value = String(2 + Math.floor(Math.random() * 12));
		controls.shadowColor.value = randomColor();
		controls.shadowHex.value = controls.shadowColor.value;

		maybeAutoGenerate();
	}

	function reset() {
		qrInput.value = "";
		controls.liveUpdate.checked = DEFAULTS.liveUpdate;
		controls.invertModules.checked = DEFAULTS.invertModules;
		controls.cellSize.value = DEFAULTS.cellSize;
		controls.quietZone.value = DEFAULTS.quietZone;
		controls.moduleScale.value = DEFAULTS.moduleScale;
		controls.moduleRoundness.value = DEFAULTS.moduleRoundness;
		controls.errorLevel.value = DEFAULTS.errorLevel;
		controls.moduleStyle.value = DEFAULTS.moduleStyle;
		controls.fgColor.value = DEFAULTS.fg;
		controls.fgHex.value = DEFAULTS.fg;
		controls.bgColor.value = DEFAULTS.bg;
		controls.bgHex.value = DEFAULTS.bg;
		controls.transparentBg.checked = DEFAULTS.transparentBg;
		controls.useGradient.checked = DEFAULTS.useGradient;
		controls.gradientEyes.checked = DEFAULTS.gradientEyes;
		controls.gradStart.value = DEFAULTS.gradStart;
		controls.gradStartHex.value = DEFAULTS.gradStart;
		controls.gradEnd.value = DEFAULTS.gradEnd;
		controls.gradEndHex.value = DEFAULTS.gradEnd;
		controls.gradientType.value = DEFAULTS.gradientType;
		controls.gradientAngle.value = DEFAULTS.gradientAngle;
		controls.eyeOuterStyle.value = DEFAULTS.eyeOuterStyle;
		controls.eyeInnerStyle.value = DEFAULTS.eyeInnerStyle;
		controls.eyeOuterColor.value = DEFAULTS.eyeOuterColor;
		controls.eyeOuterHex.value = DEFAULTS.eyeOuterColor;
		controls.eyeInnerColor.value = DEFAULTS.eyeInnerColor;
		controls.eyeInnerHex.value = DEFAULTS.eyeInnerColor;
		controls.frameStyle.value = DEFAULTS.frameStyle;
		controls.framePadding.value = DEFAULTS.framePadding;
		controls.frameRadius.value = DEFAULTS.frameRadius;
		controls.frameColor.value = DEFAULTS.frameColor;
		controls.frameHex.value = DEFAULTS.frameColor;
		controls.badgeShape.value = DEFAULTS.badgeShape;
		controls.badgeSize.value = DEFAULTS.badgeSize;
		controls.badgeBg.value = DEFAULTS.badgeBg;
		controls.badgeBgHex.value = DEFAULTS.badgeBg;
		controls.badgeImageFit.value = DEFAULTS.badgeImageFit;
		controls.badgeKnockout.checked = DEFAULTS.badgeKnockout;
		controls.showCaption.checked = DEFAULTS.showCaption;
		controls.captionText.value = DEFAULTS.captionText;
		controls.captionSize.value = DEFAULTS.captionSize;
		controls.captionColor.value = DEFAULTS.captionColor;
		controls.captionHex.value = DEFAULTS.captionColor;
		controls.useShadow.checked = DEFAULTS.useShadow;
		controls.shadowBlur.value = DEFAULTS.shadowBlur;
		controls.shadowOffset.value = DEFAULTS.shadowOffset;
		controls.shadowColor.value = DEFAULTS.shadowColor;
		controls.shadowHex.value = DEFAULTS.shadowColor;
		controls.pngSize.value = DEFAULTS.pngSize;
		controls.fileName.value = DEFAULTS.fileName;
		presetStyle.value = "";
		clearBadgeImage(true);

		if (lastObjectUrl) {
			URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = null;
		}
		lastSvgMarkup = "";
		qrPreview.innerHTML =
			'<p class="preview-placeholder">Preview will appear here.</p>';
		qrPreview.classList.remove("preview-tall");
		downloadActions.hidden = true;
		syncLabels();
		updateControlVisibility();
		setStatus("Enter text to generate.");
		qrInput.focus();
	}

	function svgWithDimensions(svgMarkup, targetWidthPx) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
		const svg = doc.documentElement;
		const viewBox = (svg.getAttribute("viewBox") || "")
			.trim()
			.split(/\s+/)
			.map(Number);
		let width = targetWidthPx;
		let height = targetWidthPx;

		if (viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
			height = Math.round((targetWidthPx * viewBox[3]) / viewBox[2]);
		}

		svg.setAttribute("width", String(width));
		svg.setAttribute("height", String(height));
		return {
			markup: new XMLSerializer().serializeToString(svg),
			width,
			height,
		};
	}

	function downloadSvg() {
		if (!lastObjectUrl) return;
		const a = document.createElement("a");
		a.href = lastObjectUrl;
		a.download = `${safeFilename(controls.fileName.value)}.svg`;
		a.rel = "noopener";
		a.click();
	}

	function downloadPng() {
		if (!lastSvgMarkup) return;
		const px = Number(controls.pngSize.value) || 512;
		const sized = svgWithDimensions(lastSvgMarkup, px);
		const blob = new Blob([sized.markup], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const img = new Image();

		img.onload = () => {
			pngCanvas.width = sized.width;
			pngCanvas.height = sized.height;
			const ctx = pngCanvas.getContext("2d");
			ctx.clearRect(0, 0, sized.width, sized.height);
			ctx.drawImage(img, 0, 0, sized.width, sized.height);
			URL.revokeObjectURL(url);
			pngCanvas.toBlob((pngBlob) => {
				if (!pngBlob) {
					setStatus("PNG export failed.");
					return;
				}
				const pngUrl = URL.createObjectURL(pngBlob);
				const a = document.createElement("a");
				a.href = pngUrl;
				a.download = `${safeFilename(controls.fileName.value)}.png`;
				a.rel = "noopener";
				a.click();
				URL.revokeObjectURL(pngUrl);
			}, "image/png");
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			setStatus("PNG export failed.");
		};

		img.src = url;
	}

	COLOR_PAIRS.forEach(([colorInput, hexInput]) =>
		pairColorControls(colorInput, hexInput),
	);

	Object.values(controls).forEach((el) => {
		if (!el) return;
		const type = el.tagName.toLowerCase();
		if (type === "button") return;
		if (el.id === "fg-color" || el.id === "fg-hex") return;
		if (el.id === "bg-color" || el.id === "bg-hex") return;
		if (el.id.endsWith("-color") || el.id.endsWith("-hex")) return;
		if (el.id === "badge-image") return;
		el.addEventListener("input", maybeAutoGenerate);
		el.addEventListener("change", maybeAutoGenerate);
	});

	controls.badgeImage.addEventListener("change", () => {
		const file = controls.badgeImage.files && controls.badgeImage.files[0];
		if (file) handleBadgeImageUpload(file);
	});
	controls.badgeImageClear.addEventListener("click", () =>
		clearBadgeImage(true),
	);

	qrInput.addEventListener("input", maybeAutoGenerate);
	qrInput.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			generate();
		}
	});

	generateBtn.addEventListener("click", generate);
	resetBtn.addEventListener("click", reset);
	randomizeBtn.addEventListener("click", randomizeDesign);
	presetStyle.addEventListener("change", () => applyPreset(presetStyle.value));
	downloadSvgBtn.addEventListener("click", downloadSvg);
	downloadPngBtn.addEventListener("click", downloadPng);

	syncLabels();
	updateControlVisibility();
	restoreBadgeImageFromStorage();

	const incomingData = getIncomingData();
	if (incomingData) {
		qrInput.value = incomingData;
		generate();
	}
})();
