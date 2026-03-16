export const callBackend = async (url: string, options: RequestInit = {}) => {
 try {
 const response = await fetch(url, {
 headers: {
 'Content-Type': 'application/json',
 },
 ...options,
 })

 if (!response.ok) {
 throw new Error(`HTTP error! Status: ${response.status}`)
 }

 return await response.json()
 } catch (error: any) {
 console.error('Backend call failed:', error)
 throw error // Re-throw to be caught by the caller
 }
}