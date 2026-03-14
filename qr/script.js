(() => {
	const input = document.getElementById("qr-input");
	const generateBtn = document.getElementById("generate-btn");
	const clearBtn = document.getElementById("clear-btn");
	const statusNote = document.getElementById("status-note");
	const results = document.getElementById("results");
	const qrPreview = document.getElementById("qr-preview");
	const qrCaption = document.getElementById("qr-caption");
	const downloadSvgBtn = document.getElementById("download-svg");
	const copySvgBtn = document.getElementById("copy-svg");
	const customizeLink = document.getElementById("customize-link");
	const customizeHelper = window.ThisQrWorksCustomize;

	let lastSvgMarkup = "";
	let lastObjectUrl = null;

	function setStatus(msg) {
		statusNote.textContent = msg;
	}

	function clearPreview() {
		qrPreview.innerHTML = "";
		qrCaption.textContent = "QR code.";
		lastSvgMarkup = "";
		if (customizeLink) {
			if (customizeHelper) {
				customizeHelper.resetCustomizeHref(customizeLink);
			} else {
				customizeLink.setAttribute("href", "/custom/");
			}
		}
		if (lastObjectUrl) {
			URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = null;
		}
	}

	function generate() {
		const text = input.value.trim();
		if (!text) {
			setStatus("Enter some text or a URL first.");
			results.hidden = true;
			clearPreview();
			return;
		}

		try {
			const qr = qrcode(0, "M");
			qr.addData(text);
			qr.make();

			lastSvgMarkup = qr.createSvgTag(6, 2);
			qrPreview.innerHTML = lastSvgMarkup;

			const svg = qrPreview.querySelector("svg");
			if (svg) {
				svg.setAttribute("role", "img");
				svg.setAttribute("aria-label", "Generated QR code");
			}

			if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = URL.createObjectURL(
				new Blob([lastSvgMarkup], { type: "image/svg+xml" }),
			);

			if (customizeLink) {
				if (customizeHelper) {
					customizeHelper.applyCustomizeHref(customizeLink, text);
				} else {
					customizeLink.setAttribute(
						"href",
						`/custom/?data=${encodeURIComponent(text)}`,
					);
				}
			}

			results.hidden = false;
			qrCaption.textContent = "QR generated.";
			setStatus("");
		} catch (err) {
			setStatus("Data too long or unsupported. Try shorter input.");
			results.hidden = true;
			clearPreview();
		}
	}

	function clear() {
		input.value = "";
		results.hidden = true;
		clearPreview();
		setStatus("Ready.");
		input.focus();
	}

	async function downloadSvg() {
		if (!lastObjectUrl) return;
		const a = document.createElement("a");
		a.href = lastObjectUrl;
		a.download = "thisqrworks-qr.svg";
		a.rel = "noopener";
		a.click();
	}

	async function copySvg() {
		if (!lastSvgMarkup) return;
		if (navigator.clipboard && window.ClipboardItem) {
			try {
				const blob = new Blob([lastSvgMarkup], { type: "image/svg+xml" });
				await navigator.clipboard.write([
					new ClipboardItem({ "image/svg+xml": blob }),
				]);
				setStatus("SVG copied.");
				return;
			} catch (_) {
				// fall through to text copy
			}
		}
		try {
			await navigator.clipboard.writeText(lastSvgMarkup);
			setStatus("SVG copied as text.");
		} catch (_) {
			setStatus("Copy not available in this browser.");
		}
	}

	// Generate on button click
	generateBtn.addEventListener("click", generate);

	// Generate on Enter (but allow newlines with Shift+Enter)
	input.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			generate();
		}
	});

	clearBtn.addEventListener("click", clear);
	downloadSvgBtn.addEventListener("click", downloadSvg);
	copySvgBtn.addEventListener("click", copySvg);
})();
