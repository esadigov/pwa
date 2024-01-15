import { NextResponse, NextRequest } from 'next/server'
import {
  getSubscriptionsFromDb,
  saveSubscriptionToDb,
} from '@/utils/db/in-memory-db'
import webpush, { PushSubscription } from 'web-push'
import { CONFIG } from '@/config'

webpush.setVapidDetails(
  'mailto:test@example.com',
  CONFIG.PUBLIC_KEY,
  CONFIG.PRIVATE_KEY
)

export async function POST(request: NextRequest) {
  try {
    const subscription = (await request.json()) as PushSubscription | null

    if (!subscription) {
      console.error('No subscription was provided!')
      return NextResponse.json({ message: 'error', error: 'No subscription provided' }, { status: 400 })
    }

    const updatedDb = await saveSubscriptionToDb(subscription)

    return NextResponse.json({ message: 'success', updatedDb })
  } catch (error) {
    console.error('Error processing subscription:', error)
    return NextResponse.json({ message: 'error', error: 'Internal server error' }, { status: 500 })
  }
}


export async function GET(_: NextRequest) {
  const subscriptions = await getSubscriptionsFromDb()

  subscriptions.forEach((s) => {
    const payload = JSON.stringify({
      title: 'WebPush Notification!',
      body: 'Hello World',
    })
    webpush.sendNotification(s, payload)
  })

  return NextResponse.json({
    message: `${subscriptions.length} messages sent!`,
  })
}
