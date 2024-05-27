// ** Next
import { NextPage } from 'next'
import { useRouter } from 'next/router'

// ** Mui
import {
  Box,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemTextProps,
  Tooltip,
  styled,
  useTheme
} from '@mui/material'

// ** React
import { useEffect, useState } from 'react'

// Custom

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Utils
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { usePermissions } from 'src/hooks/usePermissions'

// ** Type

interface TListItemText extends ListItemTextProps {
  active: boolean | undefined
}

const StyledListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    color: active ? `${theme.palette.primary.main} !important` : `rgba(${theme.palette.customColors.main},0.78)`,
    marginLeft: active ? '3px' : ''
  }
}))

type TProps = {
  data: any
  level: number
  openVertical: boolean
  fatherActive: boolean
}

// each one component will have useState and event handle difference.
export const ItemVerticalLayout: NextPage<TProps> = ({ data, level, openVertical, fatherActive }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const handleClick = () => {
    setOpen(x => !x)
  }

  const handleSelectItem = async (path: string) => {
    if (path && !data.children) {
      router.push(path)
    }
  }

  useEffect(() => {
    if (fatherActive) {
      setOpen(true)
    }
  }, [router.pathname])

  return (
    <>
      <ListItemButton
        onClick={e => {
          if (data.children) {
            handleClick()
          }

          handleSelectItem(data?.path)
        }}
        sx={{
          padding: ` 8px 20px 8px ${level === 0 ? 13 : level * 25}px`,
          my: '1px',
          backgroundColor:
            router.pathname === data.path || (fatherActive && data.children) || (open && data.children)
              ? `${hexToRGBA(theme.palette.secondary.main, 0.08)} !important`
              : theme.palette.background.paper
        }}
      >
        <Tooltip title={data.title} disableInteractive>
          <ListItemIcon>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                backgroundColor:
                  Boolean(router.pathname === data.path) || (fatherActive && data.children) || (open && data.children)
                    ? `${theme.palette.primary.main} !important`
                    : theme.palette.background.paper,
                color:
                  Boolean(router.pathname === data.path) || (fatherActive && data.children) || (open && data.children)
                    ? '#fff !important'
                    : `rgba(${theme.palette.customColors.main},0.78)`
              }}
            >
              <CustomIcon icon={data.icon} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 1 }}>
              <StyledListItemText
                primary={data.title}
                active={
                  Boolean(router.pathname === data.path) || (fatherActive && data.children) || (open && data.children)
                    ? true
                    : undefined
                }
              ></StyledListItemText>
            </Box>
          </ListItemIcon>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          {data.children && (open ? <CustomIcon icon='mdi:expand-less' /> : <CustomIcon icon='mdi:expand-more' />)}
        </Box>
      </ListItemButton>

      {data.children &&
        data.children.length > 0 &&
        openVertical &&
        data.children.map((item: any) => {
          return (
            <Collapse in={open} timeout='auto' unmountOnExit key={item.title}>
              <ItemVerticalLayout
                data={item}
                level={level + 1}
                openVertical={openVertical}
                fatherActive={fatherActive}
              />
            </Collapse>
          )
        })}
    </>
  )
}
