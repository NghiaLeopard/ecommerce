// ** Next
import { NextPage } from 'next'

// ** Mui
import { IconButton } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'

// ** Hook
import { useSettings } from 'src/hooks/useSettings'

// ** Types
import { Mode } from 'src/types/layouts'

interface TProps {}

const ModeToggle: NextPage<TProps> = () => {
  // ** Hook
  const { settings, saveSettings } = useSettings()

  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode })
  }

  const handleToggleMode = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton color='inherit' onClick={handleToggleMode}>
      <CustomIcon
        icon={
          settings.mode === 'light'
            ? 'line-md:sunny-outline-to-moon-loop-transition'
            : 'line-md:sun-rising-twotone-loop'
        }
      />
    </IconButton>
  )
}

export default ModeToggle
