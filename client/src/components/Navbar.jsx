import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../features/auth/authSlice.js'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((s) => s.auth.user)

    async function onLogout() {
        try {
            const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            await fetch(`${base}/api/auth/logout`, { method: 'POST', credentials: 'include' })
        } catch {}
        dispatch(logout())
        navigate('/auth')
    }

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
            <div className="container px-4 flex flex-wrap items-center gap-3 min-h-14 py-2">
                <Link to="/" className="font-semibold order-1">PG Finder</Link>
                <form
                    onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q')?.toString().trim(); const url = new URL(window.location.href); if (q) { url.searchParams.set('q', q) } else { url.searchParams.delete('q') } window.location.assign(url.toString()) }}
                    className="order-2 mx-auto flex items-center gap-2 w-full max-w-[600px]"
                >
                    <input name="q" type="text" placeholder="Search PGs" className="border rounded px-3 py-2 text-sm w-full" />
                    <button type="submit" className="px-3 py-2 rounded bg-black text-white text-sm whitespace-nowrap">Search</button>
                </form>
                <div className="ml-3 flex items-center gap-2 order-3">
                    {!user && <Link to="/auth" className="text-sm px-3 py-2 border rounded">Login</Link>}
                    {user && (
                        <>
                        <span className="text-sm text-gray-600">{user.name}</span>
                        <button onClick={onLogout} className="text-sm px-3 py-2 border rounded">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}


