import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
 const cookieStore = cookies()
 const supabase = createServerClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
 {
 cookies: {
 get(name: string) {
 return cookieStore.get(name)?.value
 },
 },
 }
 )
 try {
 const { fullName, hourlyRate, currency } = await request.json()
 const { data: { session } } = await supabase.auth.getSession()

 if (!session) {
 return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
 }

 const { error } = await supabase
 .from('user_settings')
 .upsert([{
 user_id: session.user.id,
 full_name: fullName,
 hourly_rate: hourlyRate,
 currency,
 }])

 if (error) {
 return NextResponse.json({ message: 'Failed to save' }, { status: 500 })
 }

 return NextResponse.json({ message: 'OK' }, { status: 200 })
 } catch (error: any) {
 return NextResponse.json({ message: error.message }, { status: 500 })
 }
}