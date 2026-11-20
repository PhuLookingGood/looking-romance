import './styles/tokens.css'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Members } from './components/Members'

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><Members /></StrictMode>)
