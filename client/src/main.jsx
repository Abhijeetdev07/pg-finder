import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { setAuthGetter } from './utils/api.js'
import { refresh, fetchMe, setInitialized } from './features/auth/authSlice.js'
import { fetchFavorites } from './features/favorites/favoritesSlice.js'

// In development, ensure any previously-registered service workers are removed
// to avoid stale cached modules breaking ESM named exports (e.g., api)
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then((registrations) => {
            registrations.forEach((r) => r.unregister());
            if (typeof caches !== 'undefined' && caches?.keys) {
                caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).catch(() => {});
            }
        })
        .catch(() => {});
}

setAuthGetter(() => store.getState().auth)

// Bootstrap auth on first load:
// 1) Try to get current user
// 2) If it fails (e.g., 401), attempt refresh once
// 3) After a successful refresh, retry fetchMe
// This avoids making refresh calls unnecessarily on every page load
async function bootstrapAuth() {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    let refreshed = false
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            await store.dispatch(refresh()).unwrap()
            refreshed = true
            break
        } catch {
            await delay(300 * (attempt + 1))
        }
    }
    if (refreshed) {
        try {
            await store.dispatch(fetchMe()).unwrap()
            store.dispatch(fetchFavorites())
        } catch {}
    }
    store.dispatch(setInitialized(true))
}

bootstrapAuth()

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
)

