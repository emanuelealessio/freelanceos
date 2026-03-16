export default function OnboardingPage() {
  return (
    <main>
      <h1>Onboarding</h1>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="hourly_rate">Hourly Rate</label>
          <input type="number" id="hourly_rate" name="hourly_rate" />
        </div>
        <div>
          <label htmlFor="currency">Currency</label>
          <select id="currency" name="currency">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}