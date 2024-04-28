// ** Next
import { IconButton } from '@mui/material'
import { NextPage } from 'next'
import CustomIcon from 'src/components/Icon'
import { useSettings } from 'src/hooks/useSettings'
import { Mode } from 'src/types/layouts'

// ** React

// ** Mui

interface TProps {}

const ModeToggle: NextPage<TProps> = () => {
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
