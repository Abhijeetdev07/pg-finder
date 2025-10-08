export function buildWhatsAppLink(phoneNumber, message) {
	const normalized = String(phoneNumber).replace(/[^0-9]/g, '');
	const text = encodeURIComponent(message || 'Hello, I am interested in your PG listing.');
	return `https://wa.me/${normalized}?text=${text}`;
}


