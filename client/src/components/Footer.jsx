export default function Footer() {
	return (
		<footer className="border-t mt-10">
			<div className="container h-16 flex items-center justify-between text-sm text-gray-600">
				<p>© {new Date().getFullYear()} PG Finder</p>
				<a href="/" className="hover:underline">Privacy</a>
			</div>
		</footer>
	);
}


