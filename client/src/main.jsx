import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { Toaster } from 'sonner'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
axios.defaults.withCredentials = true
axios.interceptors.request.use((config) => {
  if (config.url?.startsWith('http://localhost:5000')) {
    config.url = `${apiUrl}${config.url.slice('http://localhost:5000'.length)}`
  }
  return config
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster/>
    </Provider>
  </BrowserRouter>
)
