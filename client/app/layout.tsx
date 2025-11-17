import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Student Management System',
  description: 'Modern EdTech platform for student management'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)'
                }
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}