// ** Next
import { NextPage } from 'next'

// ** React
import React, { MouseEvent, useState } from 'react'

// ** Mui
import { IconButton, Menu, MenuItem, Typography } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'

// ** i18n
import { useTranslation } from 'react-i18next'

// ** Configs
import { LANGUAGE_OPTION } from 'src/configs/i18n'

interface TProps {}

const LanguageDropDown: NextPage<TProps> = () => {
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // ** Hook
  const { i18n } = useTranslation()

  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <div>
      <IconButton color='inherit' onClick={handleClick}>
        <CustomIcon icon='fa:language' />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {LANGUAGE_OPTION.map(item => {
          return (
            <MenuItem key={item.value} onClick={() => handleChangeLanguage(item.value)}>
              {item.lang}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

export default LanguageDropDown
