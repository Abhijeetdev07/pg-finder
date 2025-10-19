import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import './index.css'
import App from './App.jsx'
import { getMe, getStoredToken, setCredentials, setInitializing } from './features/auth/slice.js'
import { listFavorites } from './features/favorites/slice.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

// Auth bootstrap: rehydrate token and fetch user
const token = getStoredToken()
if (token) {
  store.dispatch(setCredentials({ token }))
  store.dispatch(setInitializing(true))
  store.dispatch(getMe())
  store.dispatch(listFavorites())
}
