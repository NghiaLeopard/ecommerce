import { useEffect, useState } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import { firebaseApp } from 'src/configs/firebase'
import { clearDeviceToken, getDeviceToken, setDeviceToken } from 'src/helpers/storage'

const useFcmToken = () => {
  const [token, setToken] = useState('')
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('')

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const messaging = getMessaging(firebaseApp)

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission()
          setNotificationPermissionStatus(permission)

          // Check if permission is granted before retrieving the token
          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.FE_VAPID_KEY
            })
            if (currentToken) {
              setToken(currentToken)
            } else {
              console.log('No registration token available. Request permission to generate one.')
            }
          }
        }
      } catch (error) {
        console.log('An error occurred while retrieving token:', error)
      }
    }

    if (token && token !== getDeviceToken()) {
      clearDeviceToken()
      setDeviceToken(token)
    }

    retrieveToken()
  }, [])

  return { fcmToken: token, notificationPermissionStatus }
}

export default useFcmToken
