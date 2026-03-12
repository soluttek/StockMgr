import { Html5Qrcode } from "html5-qrcode";

let scanner = null;
let isScanning = false;

export async function startScanner(containerId, onScanSuccess) {
	if (isScanning) return;

	scanner = new Html5Qrcode(containerId);
	isScanning = true;

	const config = {
		fps: 10,
		qrbox: { width: 280, height: 150 },
		aspectRatio: 1.0,
		formatsToSupport: [
			0, // QR_CODE
			1, // AZTEC
			2, // CODABAR
			3, // CODE_39
			4, // CODE_93
			5, // CODE_128
			6, // DATA_MATRIX
			7, // MAXICODE
			8, // ITF
			9, // EAN_13
			10, // EAN_8
			11, // PDF_417
			12, // RSS_14
			13, // RSS_EXPANDED
			14, // UPC_A
			15, // UPC_E
			16, // UPC_EAN_EXTENSION
		],
	};

	try {
		await scanner.start(
			{ facingMode: "environment" },
			config,
			(decodedText) => {
				onScanSuccess(decodedText);
			},
			() => {},
		);
	} catch (err) {
		isScanning = false;
		throw new Error(`Error al acceder a la cámara: ${err.message || err}`);
	}
}

export async function stopScanner() {
	if (!scanner || !isScanning) return;
	try {
		await scanner.stop();
		scanner.clear();
	} catch (err) {
		console.warn("Error deteniendo escáner:", err);
	}
	isScanning = false;
	scanner = null;
}

export function isScannerActive() {
	return isScanning;
}
