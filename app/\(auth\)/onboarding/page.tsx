import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const name = (event.target as HTMLFormElement).name.value
    const hourly_rate = (event.target as HTMLFormElement).hourly_rate.value
    const currency = (event.target as HTMLFormElement).currency.value

    const supabase = createClientComponentClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Here you would save the user details to the database
    // using a Supabase function or API route

    router.push('/dashboard')

  }

  return (
    <main>
      <h1>Onboarding</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="hourly_rate">Hourly Rate</label>
          <input type="number" id="hourly_rate" name="hourly_rate" required />
        </div>
        <div>
          <label htmlFor="currency">Currency</label>
          <select id="currency" name="currency" required>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}