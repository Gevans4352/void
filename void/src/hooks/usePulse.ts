import { useState } from 'react'
import api from '../lib/api'

const usePulse = () => {
  const [pulsing, setPulsing] = useState<string | null>(null)

  const pulse = async (fragmentId: string) => {
    if (pulsing) return
    setPulsing(fragmentId)

    try {
      await api.post(`/fragments/${fragmentId}/pulse`)
    } catch (err) {
      console.log('pulse failed', err)
    } finally {
      setTimeout(() => setPulsing(null), 1500)
    }
  }

  return { pulse, pulsing }
}

export default usePulse