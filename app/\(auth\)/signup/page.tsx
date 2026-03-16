import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const email = (event.target as HTMLFormElement).email.value
    const password = (event.target as HTMLFormElement).password.value

    const supabase = createClientComponentClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {},
    })

    if (error) {
      console.error(error)
      alert(error.message)
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <a href="/login">Login</a>
    </main>
  )
}