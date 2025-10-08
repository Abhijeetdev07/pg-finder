import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './app/store.js'
import { setAuthGetter } from './utils/api.js'
import { refresh, fetchMe } from './features/auth/authSlice.js'

setAuthGetter(() => store.getState().auth)

// Bootstrap auth on first load: try refresh -> fetchMe
store.dispatch(refresh()).then(() => {
    store.dispatch(fetchMe())
}).catch(() => {})

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>,
)
