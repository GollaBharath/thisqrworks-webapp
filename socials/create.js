(() => {
	const form = document.getElementById("create-form");
	const statusNote = document.getElementById("status-note");
	const results = document.getElementById("results");
	const linkOutput = document.getElementById("share-link");
	const copyLinkButton = document.getElementById("copy-link");
	const downloadButton = document.getElementById("download-qr");
	const copySvgButton = document.getElementById("copy-svg");
	const clearButton = document.getElementById("clear-form");
	const qrPreview = document.getElementById("qr-preview");
	const qrCaption = document.getElementById("qr-caption");

	const PLATFORM_FIELDS = [
		{ code: "wa", input: document.getElementById("wa-id"), label: "WhatsApp" },
		{ code: "dc", input: document.getElementById("dc-id"), label: "Discord" },
		{ code: "fb", input: document.getElementById("fb-id"), label: "Facebook" },
		{ code: "ig", input: document.getElementById("ig-id"), label: "Instagram" },
		{ code: "yt", input: document.getElementById("yt-id"), label: "YouTube" },
	];

	let lastSvgMarkup = "";
	let lastObjectUrl = null;

	function setStatus(message) {
		statusNote.textContent = message;
	}

	function generateUid() {
		if (crypto.randomUUID) {
			return crypto.randomUUID().replace(/-/g, "");
		}
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);
		return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
			""
		);
	}

	function base64UrlEncode(value) {
		const bytes = new TextEncoder().encode(value);
		let binary = "";
		bytes.forEach((byte) => {
			binary += String.fromCharCode(byte);
		});
		const base64 = btoa(binary)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "");
		return base64;
	}

	function buildShareLink(socialMap) {
		const payload = { v: 1, uid: generateUid(), s: socialMap };
		const serialized = JSON.stringify(payload);
		const encoded = base64UrlEncode(serialized);
		const baseUrl = new URL("profile.html", window.location.href);
		baseUrl.hash = encoded;
		return baseUrl.toString();
	}

	function collectSocialInputs() {
		const collected = {};
		PLATFORM_FIELDS.forEach(({ code, input }) => {
			if (!input) return;
			const value = input.value.trim();
			if (value) {
				collected[code] = value;
			}
		});
		return collected;
	}

	function clearPreview() {
		qrPreview.innerHTML = "";
		qrCaption.textContent = "QR preview.";
		lastSvgMarkup = "";
		if (lastObjectUrl) {
			URL.revokeObjectURL(lastObjectUrl);
			lastObjectUrl = null;
		}
		downloadButton.dataset.url = "";
	}

	function renderQr(link) {
		const qr = qrcode(0, "M");
		qr.addData(link);
		qr.make();

		lastSvgMarkup = qr.createSvgTag(6, 2);
		qrPreview.innerHTML = lastSvgMarkup;

		const svgElement = qrPreview.querySelector("svg");
		if (svgElement) {
			svgElement.setAttribute("role", "img");
			svgElement.setAttribute(
				"aria-label",
				"QR code for the generated profile link"
			);
		}

		if (lastObjectUrl) {
			URL.revokeObjectURL(lastObjectUrl);
		}
		lastObjectUrl = URL.createObjectURL(
			new Blob([lastSvgMarkup], { type: "image/svg+xml" })
		);
		downloadButton.dataset.url = lastObjectUrl;
		qrCaption.textContent = "QR Generated.";
	}

	async function copyLink() {
		if (!linkOutput.value) return;
		try {
			await navigator.clipboard.writeText(linkOutput.value);
			setStatus("Link copied to clipboard.");
		} catch (_error) {
			setStatus("Copy not available in this browser.");
		}
	}

	async function copySvg() {
		if (!lastSvgMarkup) return;
		if (navigator.clipboard && window.ClipboardItem) {
			try {
				const blob = new Blob([lastSvgMarkup], { type: "image/svg+xml" });
				await navigator.clipboard.write([
					new ClipboardItem({ "image/svg+xml": blob }),
				]);
				setStatus("SVG copied to clipboard.");
				return;
			} catch (_error) {
				// Fall back to text copy below.
			}
		}
		try {
			await navigator.clipboard.writeText(lastSvgMarkup);
			setStatus("SVG copied as text.");
		} catch (_error) {
			setStatus("Copy not available in this browser.");
		}
	}

	function downloadSvg() {
		const url = downloadButton.dataset.url;
		if (!url) return;
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = "thisqrworks-profile.svg";
		anchor.rel = "noopener";
		anchor.click();
	}

	function handleSubmit(event) {
		event.preventDefault();
		const socialMap = collectSocialInputs();

		if (Object.keys(socialMap).length === 0) {
			setStatus("Add at least one identifier to generate a QR.");
			results.hidden = true;
			clearPreview();
			return;
		}

		const shareLink = buildShareLink(socialMap);
		linkOutput.value = shareLink;
		results.hidden = false;
		setStatus("");
		renderQr(shareLink);
	}

	function clearForm() {
		form.reset();
		linkOutput.value = "";
		results.hidden = true;
		setStatus("All inputs are optional.");
		clearPreview();
	}

	form.addEventListener("submit", handleSubmit);
	clearButton.addEventListener("click", clearForm);
	copyLinkButton.addEventListener("click", copyLink);
	copySvgButton.addEventListener("click", copySvg);
	downloadButton.addEventListener("click", downloadSvg);

	setStatus("All inputs are optional.");
})();
