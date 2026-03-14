(() => {
	// --- Element refs ---
	const tabUpload = document.getElementById("tab-upload");
	const tabCamera = document.getElementById("tab-camera");
	const panelUpload = document.getElementById("panel-upload");
	const panelCamera = document.getElementById("panel-camera");

	const dropZone = document.getElementById("drop-zone");
	const fileInput = document.getElementById("file-input");
	const dropHint = document.getElementById("drop-hint");
	const decodeCanvas = document.getElementById("decode-canvas");

	const cameraView = document.getElementById("camera-view");
	const cameraCanvas = document.getElementById("camera-canvas");
	const startCameraBtn = document.getElementById("start-camera");
	const stopCameraBtn = document.getElementById("stop-camera");
	const cameraStatus = document.getElementById("camera-status");

	const resultBlock = document.getElementById("result-block");
	const resultText = document.getElementById("result-text");
	const copyResultBtn = document.getElementById("copy-result");
	const openUrlBtn = document.getElementById("open-url");
	const statusNote = document.getElementById("status-note");

	let cameraStream = null;
	let scanLoop = null;
	let lastDecodedData = "";

	// --- Helpers ---
	function setStatus(msg) {
		statusNote.textContent = msg;
	}

	function isUrl(str) {
		try {
			const u = new URL(str);
			return u.protocol === "http:" || u.protocol === "https:";
		} catch (_) {
			return false;
		}
	}

	function showResult(data) {
		lastDecodedData = data;
		resultText.value = data;
		resultBlock.hidden = false;

		if (isUrl(data)) {
			openUrlBtn.href = data;
			openUrlBtn.hidden = false;
		} else {
			openUrlBtn.hidden = true;
		}
	}

	function hideResult() {
		resultBlock.hidden = true;
		lastDecodedData = "";
	}

	// --- Tab switching ---
	function switchTab(tab) {
		const isUpload = tab === "upload";

		tabUpload.classList.toggle("active", isUpload);
		tabUpload.setAttribute("aria-selected", String(isUpload));
		tabCamera.classList.toggle("active", !isUpload);
		tabCamera.setAttribute("aria-selected", String(!isUpload));

		panelUpload.hidden = !isUpload;
		panelCamera.hidden = isUpload;

		if (isUpload) {
			stopCamera();
			setStatus("Ready.");
		} else {
			hideResult();
			setStatus("Camera not started.");
		}
	}

	tabUpload.addEventListener("click", () => switchTab("upload"));
	tabCamera.addEventListener("click", () => switchTab("camera"));

	// --- Upload / drop zone ---
	function decodeImageFile(file) {
		if (!file || !file.type.startsWith("image/")) {
			setStatus("Please select an image file.");
			return;
		}

		setStatus("Reading image...");
		hideResult();
		dropHint.textContent = file.name;

		const img = new Image();
		const url = URL.createObjectURL(file);

		img.onload = () => {
			const ctx = decodeCanvas.getContext("2d");
			decodeCanvas.width = img.naturalWidth;
			decodeCanvas.height = img.naturalHeight;
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);

			const imageData = ctx.getImageData(
				0,
				0,
				decodeCanvas.width,
				decodeCanvas.height,
			);
			const result = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "dontInvert",
			});

			if (result) {
				showResult(result.data);
				setStatus("QR decoded.");
			} else {
				// retry with inverted colours (white-on-black QR codes)
				const result2 = jsQR(
					imageData.data,
					imageData.width,
					imageData.height,
					{ inversionAttempts: "onlyInvert" },
				);
				if (result2) {
					showResult(result2.data);
					setStatus("QR decoded.");
				} else {
					setStatus(
						"No QR code found. Make sure the image is clear and well-lit.",
					);
				}
			}
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			setStatus("Could not load image.");
		};

		img.src = url;
	}

	dropZone.addEventListener("click", () => fileInput.click());

	dropZone.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			fileInput.click();
		}
	});

	fileInput.addEventListener("change", () => {
		if (fileInput.files[0]) decodeImageFile(fileInput.files[0]);
	});

	dropZone.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZone.classList.add("dragover");
	});

	dropZone.addEventListener("dragleave", () => {
		dropZone.classList.remove("dragover");
	});

	dropZone.addEventListener("drop", (e) => {
		e.preventDefault();
		dropZone.classList.remove("dragover");
		const file = e.dataTransfer.files[0];
		if (file) decodeImageFile(file);
	});

	// Paste an image anywhere on the page
	document.addEventListener("paste", (e) => {
		if (panelUpload.hidden) return;
		const item = Array.from(e.clipboardData.items).find((i) =>
			i.type.startsWith("image/"),
		);
		if (item) {
			const file = item.getAsFile();
			if (file) decodeImageFile(file);
		}
	});

	// --- Camera ---
	function stopCamera() {
		if (scanLoop) {
			cancelAnimationFrame(scanLoop);
			scanLoop = null;
		}
		if (cameraStream) {
			cameraStream.getTracks().forEach((t) => t.stop());
			cameraStream = null;
			cameraView.srcObject = null;
		}
		startCameraBtn.hidden = false;
		stopCameraBtn.hidden = true;
		cameraStatus.textContent = "Camera stopped.";
	}

	async function startCamera() {
		cameraStatus.textContent = "Requesting camera access...";
		try {
			cameraStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
				audio: false,
			});
			cameraView.srcObject = cameraStream;
			await cameraView.play();
			startCameraBtn.hidden = true;
			stopCameraBtn.hidden = false;
			cameraStatus.textContent = "Scanning...";
			hideResult();
			scheduleScan();
		} catch (err) {
			cameraStatus.textContent =
				err.name === "NotAllowedError"
					? "Camera access denied. Please allow camera access and try again."
					: "Could not start camera: " + err.message;
		}
	}

	function scheduleScan() {
		scanLoop = requestAnimationFrame(scanFrame);
	}

	function scanFrame() {
		if (!cameraStream) return;

		const video = cameraView;
		if (video.readyState < video.HAVE_ENOUGH_DATA) {
			scheduleScan();
			return;
		}

		const ctx = cameraCanvas.getContext("2d");
		cameraCanvas.width = video.videoWidth;
		cameraCanvas.height = video.videoHeight;
		ctx.drawImage(video, 0, 0, cameraCanvas.width, cameraCanvas.height);

		const imageData = ctx.getImageData(
			0,
			0,
			cameraCanvas.width,
			cameraCanvas.height,
		);
		const result = jsQR(imageData.data, imageData.width, imageData.height, {
			inversionAttempts: "dontInvert",
		});

		if (result && result.data !== lastDecodedData) {
			showResult(result.data);
			cameraStatus.textContent = "QR code found.";
		}

		scheduleScan();
	}

	startCameraBtn.addEventListener("click", startCamera);
	stopCameraBtn.addEventListener("click", stopCamera);

	// --- Copy result ---
	copyResultBtn.addEventListener("click", async () => {
		if (!lastDecodedData) return;
		try {
			await navigator.clipboard.writeText(lastDecodedData);
			setStatus("Copied to clipboard.");
		} catch (_) {
			setStatus("Copy not available in this browser.");
		}
	});

	// Cleanup camera on page unload
	window.addEventListener("pagehide", stopCamera);
})();
