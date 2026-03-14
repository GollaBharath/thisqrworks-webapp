(() => {
	const CUSTOM_BASE_PATH = "/custom/";

	function normalizeData(data) {
		if (typeof data !== "string") return "";
		return data.trim();
	}

	function buildCustomizeHref(data) {
		const normalized = normalizeData(data);
		if (!normalized) return CUSTOM_BASE_PATH;
		return `${CUSTOM_BASE_PATH}?data=${encodeURIComponent(normalized)}`;
	}

	function applyCustomizeHref(anchorElement, data) {
		if (!anchorElement) return;
		anchorElement.setAttribute("href", buildCustomizeHref(data));
	}

	function resetCustomizeHref(anchorElement) {
		if (!anchorElement) return;
		anchorElement.setAttribute("href", CUSTOM_BASE_PATH);
	}

	window.ThisQrWorksCustomize = {
		buildCustomizeHref,
		applyCustomizeHref,
		resetCustomizeHref,
	};
})();
