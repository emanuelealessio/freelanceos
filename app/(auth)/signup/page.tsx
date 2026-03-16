"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}>
      <div style={{background:'#111',padding:'2rem',borderRadius:'12px',width:'100%',maxWidth:'400px',border:'1px solid #2a2a2a'}}>
        <h1 style={{color:'#fafafa',fontSize:'1.5rem',fontWeight:'bold',marginBottom:'0.5rem'}}>Crea account</h1>
        <p style={{color:'#888',marginBottom:'1.5rem'}}>Inizia gratis con FreelanceOS</p>
        <form onSubmit={handleSignUp}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{color:'#888',fontSize:'0.875rem',display:'block',marginBottom:'0.25rem'}}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:'100%',padding:'0.75rem',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'8px',color:'#fafafa',fontSize:'1rem',boxSizing:'border-box'}} />
          </div>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{color:'#888',fontSize:'0.875rem',display:'block',marginBottom:'0.25rem'}}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%',padding:'0.75rem',background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'8px',color:'#fafafa',fontSize:'1rem',boxSizing:'border-box'}} />
          </div>
          {error && <p style={{color:'#ef4444',marginBottom:'1rem',fontSize:'0.875rem'}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'0.75rem',background:'#6366f1',color:'white',border:'none',borderRadius:'8px',fontSize:'1rem',fontWeight:'600',cursor:'pointer'}}
          >
            {loading ? 'Caricamento...' : 'Crea account'}
          </button>
        </form>
        <p style={{color:'#888',textAlign:'center',marginTop:'1rem',fontSize:'0.875rem'}}>
          Hai già un account? <Link href="/login" style={{color:'#6366f1'}}>Accedi</Link>
        </p>
      </div>
    </div>
  )
}