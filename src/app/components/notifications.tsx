'use client'

import { CONFIG } from "@/config"
import { registerServiceWorker, unregisterServiceWorkers } from "@/utils/sw/service-worker"
import { useState } from "react"
import { Notice } from "./notice"
import Link from "next/link"

const notificationsSupported = () =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

  export default function Notifications() {
    const [permission, setPermission] = useState(
      window?.Notification?.permission || 'default'
    )
  
    if (!notificationsSupported()) {
      return (
        <Notice message="Please install this app on your home screen first!" />
      )
    }
  
    const requestPermission = async () => {
      if (!notificationsSupported()) {
        return
      }
  
      const receivedPermission = await window?.Notification.requestPermission()
      setPermission(receivedPermission)
  
      if (receivedPermission === 'granted') {
        subscribe()
      }
    }
  
    return (
      <>
        <Notice message={`Notifications permission status: ${permission}`} />
        <button onClick={requestPermission}>
          Request permission and subscribe
        </button>
        <Link href="/debug">Debug options</Link>
      </>
    )
  }

const saveSubscription = async (subscription: PushSubscription) => {
    const ORIGIN = window.location.origin
    const BACKEND_URL = `${ORIGIN}/api/push`
  
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
    return response.json()
  }


const subscribe = async () => {
    await unregisterServiceWorkers()
  
    const swRegistration = await registerServiceWorker()
  
    try {
      const options = {
        applicationServerKey: CONFIG.PUBLIC_KEY,
        userVisibleOnly: true,
      }
      const subscription = await swRegistration.pushManager.subscribe(options)
  
      await saveSubscription(subscription)
  
      console.log({ subscription })
    } catch (err) {
      console.error('Error', err)
    }
  }