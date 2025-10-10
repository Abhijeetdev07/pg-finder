export default function Footer() {
	return (
		<footer className="border-t mt-10 bg-gray-50">
			<div className="container px-4 py-8">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
					{/* Company Info */}
					<div className="space-y-3">
						<h3 className="font-semibold text-gray-900">PG Finder</h3>
						<p className="text-sm text-gray-600 max-w-[300px]">
							Find the perfect PG accommodation near your college. 
							Search, compare, and book online.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-3">
						<h3 className="font-semibold text-gray-900">Quick Links</h3>
						<ul className="space-y-2 text-sm text-gray-600">
							<li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
							<li><a href="/search" className="hover:text-gray-900 transition-colors">Search PGs</a></li>
							<li><a href="/favorites" className="hover:text-gray-900 transition-colors">My Favorites</a></li>
							<li><a href="/me/bookings" className="hover:text-gray-900 transition-colors">My Bookings</a></li>
						</ul>
					</div>

					{/* For Students */}
					<div className="space-y-3">
						<h3 className="font-semibold text-gray-900">Students</h3>
						<ul className="space-y-2 text-sm text-gray-600">
							<li><a href="/auth" className="hover:text-gray-900 transition-colors">Sign Up</a></li>
							<li><a href="/auth" className="hover:text-gray-900 transition-colors">Login</a></li>
							<li><a href="/me/inquiries" className="hover:text-gray-900 transition-colors">My Inquiries</a></li>
							<li><a href="/request-visit" className="hover:text-gray-900 transition-colors">Request Visit</a></li>
						</ul>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="border-t pt-6">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="text-sm text-gray-600">
							© {new Date().getFullYear()} PG Finder. All rights reserved.
						</div>
						<div className="flex items-center gap-6 text-sm text-gray-600">
							<a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
							<a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
							<a href="/contact" className="hover:text-gray-900 transition-colors">Contact</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}


