
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login, register as registerThunk } from '../features/auth/authSlice'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { status } = useSelector((s) => s.auth)

    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'student' })
    const [loginSubmitting, setLoginSubmitting] = useState(false)
    const [regSubmitting, setRegSubmitting] = useState(false)
    const [showLoginPassword, setShowLoginPassword] = useState(false)
    const [showRegPassword, setShowRegPassword] = useState(false)

    const mode = (searchParams.get('mode') || 'register').toLowerCase()

    async function onLogin() {
        try {
            setLoginSubmitting(true)
            const res = await dispatch(login(loginForm)).unwrap()
            toast.success(`Welcome ${res.user.name}`)
            navigate(res.user?.role === 'owner' ? '/owner' : '/')
        } catch (e) {
            toast.error(e?.message || 'Login failed')
        } finally {
            setLoginSubmitting(false)
        }
    }

    async function onRegister() {
        try {
            setRegSubmitting(true)
            const res = await dispatch(registerThunk(regForm)).unwrap()
            toast.success('Registered successfully')
            navigate(res.user?.role === 'owner' ? '/owner' : '/')
        } catch (e) {
            toast.error(e?.message || 'Register failed')
        } finally {
            setRegSubmitting(false)
        }
    }

    return (
        <section className="p-4 min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md border rounded-lg shadow bg-white p-6">
                {mode === 'login' ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
                        <div className="space-y-3">
                            <input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} type="email" placeholder="Email" className="border rounded px-3 py-2 w-full" />
                            <div className="relative">
                                <input value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} type={showLoginPassword ? 'text' : 'password'} placeholder="Password" className="border rounded px-3 py-2 w-full pr-10" />
                                <button type="button" aria-label={showLoginPassword ? 'Hide password' : 'Show password'} onClick={() => setShowLoginPassword((v) => !v)} className="absolute inset-y-0 right-2 flex items-center text-gray-600">
                                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <button disabled={loginSubmitting} onClick={onLogin} type="button" className="px-4 py-2 rounded bg-black text-white w-full disabled:opacity-60">
                                {loginSubmitting ? 'Please wait...' : 'Login'}
                            </button>
                            <p className="text-sm text-gray-600 text-center">
                                New here?{' '}
                                <Link to="/auth" onClick={(e) => { e.preventDefault(); setSearchParams({}); }} className="underline">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
                        <div className="space-y-3">
                            <input value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} type="text" placeholder="Name" className="border rounded px-3 py-2 w-full" />
                            <input value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} type="email" placeholder="Email" className="border rounded px-3 py-2 w-full" />
                            <div className="relative">
                                <input value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} type={showRegPassword ? 'text' : 'password'} placeholder="Password" className="border rounded px-3 py-2 w-full pr-10" />
                                <button type="button" aria-label={showRegPassword ? 'Hide password' : 'Show password'} onClick={() => setShowRegPassword((v) => !v)} className="absolute inset-y-0 right-2 flex items-center text-gray-600">
                                    {showRegPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <select value={regForm.role} onChange={(e) => setRegForm({ ...regForm, role: e.target.value })} className="border rounded px-3 py-2 w-full">
                                <option value="student">Student</option>
                                <option value="owner">Owner</option>
                            </select>
                            <button disabled={regSubmitting} onClick={onRegister} type="button" className="px-4 py-2 rounded bg-black text-white w-full disabled:opacity-60">
                                {regSubmitting ? 'Please wait...' : 'Register'}
                            </button>
                            <p className="text-sm text-gray-600 text-center">
                                Already have an account?{' '}
                                <Link to="/auth?mode=login" onClick={(e) => { e.preventDefault(); setSearchParams({ mode: 'login' }); }} className="underline">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}


