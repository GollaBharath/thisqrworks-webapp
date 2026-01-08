(() => {
	const statusMessage = document.getElementById("status-message");
	const profileList = document.getElementById("profile-links");

	// Resolver table maps platform codes to metadata and link builders.
	const PLATFORM_RESOLVERS = {
		wa: {
			name: "WhatsApp",
			buildUrl: (id) => `https://wa.me/${encodeURIComponent(id)}`,
			icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.66 15.06L2 22l5.14-1.33A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.24-1.23l-.3-.19-3 .77.79-2.92-.2-.3A8 8 0 1 1 12 20Zm4.42-5.12c-.24-.12-1.42-.7-1.64-.78s-.38-.12-.54.12-.62.78-.76.94-.28.18-.52.06a6.56 6.56 0 0 1-1.93-1.19 7.2 7.2 0 0 1-1.33-1.65c-.14-.24 0-.37.1-.49s.24-.28.36-.43a1.62 1.62 0 0 0 .24-.41.45.45 0 0 0 0-.43c0-.12-.54-1.3-.74-1.79s-.4-.41-.54-.42h-.46a.9.9 0 0 0-.64.3 2.7 2.7 0 0 0-.84 2c0 1.18.86 2.34 1 2.5s1.7 2.6 4.12 3.65a14 14 0 0 0 1.38.51 3.32 3.32 0 0 0 1.54.1 2.53 2.53 0 0 0 1.65-1.16 2.06 2.06 0 0 0 .14-1.17c-.06-.1-.22-.16-.46-.28Z"/></svg>',
		},
		dc: {
			name: "Discord",
			buildUrl: (id) => `https://discord.com/users/${encodeURIComponent(id)}`,
			icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.36 4.21A16.62 16.62 0 0 0 15.37 3a11.94 11.94 0 0 0-.58 1.18 15.58 15.58 0 0 0-5.58 0A11.37 11.37 0 0 0 8.63 3a16.38 16.38 0 0 0-4 1.26c-2.53 3.63-3.21 7.18-2.87 10.67a17 17 0 0 0 5 2.53 12.46 12.46 0 0 0 1.08-1.73 10.37 10.37 0 0 1-1.71-.82l.41-.31a11.82 11.82 0 0 0 10.92 0l.41.31a10.24 10.24 0 0 1-1.72.83 11.88 11.88 0 0 0 1.09 1.72 16.85 16.85 0 0 0 5-2.53c.41-4.21-.7-7.72-2.67-10.64ZM8.83 13.29c-1 0-1.78-.93-1.78-2.07s.78-2.07 1.78-2.07 1.8.94 1.78 2.07-.78 2.07-1.78 2.07Zm6.35 0c-1 0-1.78-.93-1.78-2.07s.8-2.07 1.78-2.07 1.8.94 1.8 2.07-.81 2.07-1.8 2.07Z"/></svg>',
		},
		fb: {
			name: "Facebook",
			buildUrl: (id) => `https://facebook.com/${encodeURIComponent(id)}`,
			icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 20.91v-7h2.35l.35-2.72H13.4V9.35c0-.79.22-1.33 1.36-1.33h1.45V5.6a19.23 19.23 0 0 0-2.12-.1c-2.1 0-3.54 1.28-3.54 3.62v2h-2.38v2.72h2.38v7Z"/></svg>',
		},
		ig: {
			name: "Instagram",
			buildUrl: (id) => `https://instagram.com/${encodeURIComponent(id)}`,
			icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 2h-9A5.51 5.51 0 0 0 2 7.5v9A5.51 5.51 0 0 0 7.5 22h9a5.51 5.51 0 0 0 5.5-5.5v-9A5.51 5.51 0 0 0 16.5 2Zm3.5 14.5A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5Zm-8-7.5a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm5.75-8.88a1.25 1.25 0 1 0 1.25 1.25 1.25 1.25 0 0 0-1.25-1.25Z"/></svg>',
		},
		yt: {
			name: "YouTube",
			buildUrl: (id) => `https://youtube.com/${encodeURIComponent(id)}`,
			icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.58 6.2a2.51 2.51 0 0 0-1.76-1.76A53.4 53.4 0 0 0 12 4a53.4 53.4 0 0 0-7.82.44 2.51 2.51 0 0 0-1.76 1.76A26.23 26.23 0 0 0 2 12a26.23 26.23 0 0 0 .42 5.8 2.51 2.51 0 0 0 1.76 1.76A53.4 53.4 0 0 0 12 20a53.4 53.4 0 0 0 7.82-.44 2.51 2.51 0 0 0 1.76-1.76A26.23 26.23 0 0 0 22 12a26.23 26.23 0 0 0-.42-5.8ZM10 15.5V8.5L15.5 12Z"/></svg>',
		},
	};

	/**
	 * Decodes a Base64URL payload into a UTF-8 string safely.
	 * Padding is restored and the string is decoded with TextDecoder
	 * to avoid malformed Unicode sequences.
	 */
	function decodeBase64Url(payload) {
		const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
		const paddingNeeded = (4 - (normalized.length % 4)) % 4;
		const padded = normalized + "=".repeat(paddingNeeded);
		const binary = atob(padded);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) {
			bytes[i] = binary.charCodeAt(i);
		}
		return new TextDecoder().decode(bytes);
	}

	/**
	 * Safely reads window.location.hash, decodes, and parses payloads.
	 * All exceptions bubble up to a single handling point.
	 */
	function readPayload() {
		const hash = window.location.hash;
		if (!hash || hash.length <= 1) {
			throw new Error("empty-hash");
		}
		const encodedPayload = hash.substring(1);
		const decoded = decodeBase64Url(encodedPayload);
		const parsed = JSON.parse(decoded);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			throw new Error("invalid-structure");
		}
		if (!parsed.s || typeof parsed.s !== "object" || Array.isArray(parsed.s)) {
			throw new Error("missing-s");
		}
		return parsed;
	}

	/**
	 * Builds and displays profile rows for known platforms only.
	 * Unknown platform codes or empty identifiers are ignored silently.
	 */
	function renderProfiles(payload) {
		const entries = Object.entries(payload.s);
		const fragments = document.createDocumentFragment();
		let renderedCount = 0;

		entries.forEach(([code, identifier]) => {
			const resolver = PLATFORM_RESOLVERS[code];
			if (!resolver || typeof identifier !== "string" || !identifier.trim()) {
				return;
			}

			const url = resolver.buildUrl(identifier.trim());
			const link = document.createElement("a");
			link.className = "profile-link";
			link.href = url;
			link.target = "_blank";
			link.rel = "noopener noreferrer";
			link.setAttribute("data-platform", code);

			const iconWrapper = document.createElement("span");
			iconWrapper.className = "platform-icon";
			iconWrapper.innerHTML = resolver.icon;
			link.appendChild(iconWrapper);

			const textWrapper = document.createElement("span");
			textWrapper.className = "platform-text";

			const title = document.createElement("p");
			title.className = "platform-name";
			title.textContent = resolver.name;

			const hint = document.createElement("p");
			hint.className = "platform-hint";
			hint.textContent = identifier.trim();

			textWrapper.appendChild(title);
			textWrapper.appendChild(hint);
			link.appendChild(textWrapper);

			const listItem = document.createElement("li");
			listItem.appendChild(link);
			fragments.appendChild(listItem);
			renderedCount += 1;
		});

		if (renderedCount === 0) {
			throw new Error("no-platforms");
		}

		profileList.innerHTML = "";
		profileList.appendChild(fragments);
		profileList.hidden = false;
		statusMessage.textContent = "Verified profile links";
	}

	function showStatus(message) {
		statusMessage.textContent = message;
		profileList.hidden = true;
		profileList.innerHTML = "";
	}

	/**
	 * Centralized control flow ensures a single point of failure handling.
	 * Individual errors are mapped to calm, user-friendly descriptions.
	 */
	function processHash() {
		try {
			const payload = readPayload();
			renderProfiles(payload);
		} catch (error) {
			switch (error.message) {
				case "empty-hash":
					showStatus("No profile data found.");
					break;
				case "missing-s":
				case "no-platforms":
					showStatus("No recognized profile links available.");
					break;
				case "invalid-structure":
					showStatus("Profile data is unavailable.");
					break;
				default:
					showStatus("Profile data could not be decoded.");
			}
		}
	}

	window.addEventListener("hashchange", processHash);
	processHash();
})();
