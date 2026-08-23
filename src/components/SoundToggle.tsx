import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { sounds } from '../utils/sounds'
import { useStore } from '../store/useStore'

export function SoundToggle() {
  const soundEnabled = useStore((s) => s.soundEnabled)
  const toggleSound = useStore((s) => s.toggleSound)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2 }}
      onClick={() => {
        if (!soundEnabled) sounds.play('click')
        toggleSound()
      }}
      className="fixed top-4 right-16 z-50 p-2 rounded-lg transition-all hover:scale-110 md:hidden"
      style={{
        background: 'rgba(13, 27, 42, 0.8)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(0, 212, 255, 0.15)',
        color: soundEnabled ? '#00d4ff' : '#556677',
      }}
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
    </motion.button>
  )
}
