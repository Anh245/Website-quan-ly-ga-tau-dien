// auth-context.js
import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/authServicesAPI'
import { toast } from 'sonner'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  // Verify token on load
  useEffect(() => {
    if (!token) return
    setLoading(true)
    authAPI.verifyToken(token)
      .then((res) => setUser(res.user))
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const res = await authAPI.login(credentials)
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('token', res.token)
      toast.success('Đăng nhập thành công!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  const register = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register(data)
      setToken(res.token)
      setUser(res.user)
      localStorage.setItem('token', res.token)
      toast.success('Đăng ký thành công!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    toast.success('Đăng xuất thành công!')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading: loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}