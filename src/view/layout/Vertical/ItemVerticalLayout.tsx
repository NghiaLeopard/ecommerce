// ** Next
import { NextPage } from 'next'

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
import { useState } from 'react'

// Custom
import CustomIcon from 'src/components/Icon'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface TListItemText extends ListItemTextProps {
  active: boolean
}

const StyledListItemText = styled(ListItemText)<TListItemText>(({ theme, active }) => ({
  '.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary': {
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: active ? '#fff !important' : `rgba(${theme.palette.customColors.main},0.78)`
  }
}))

type TProps = {
  data: any
  level: number
  openVertical: boolean
}

// each one component will have useState and event handle difference.
export const ItemVerticalLayout: NextPage<TProps> = ({ data, level, openVertical }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const handleClick = () => {
    setOpen(x => !x)
  }

  return (
    <>
      <ListItemButton
        onClick={e => {
          if (data.children) {
            handleClick()
          }
        }}
        sx={{
          padding: ` 8px 20px 8px ${level === 0 ? 13 : level * 25}px`,
          backgroundColor:
            router.pathname === data.path || open
              ? `${theme.palette.primary.main} !important`
              : theme.palette.background.paper
        }}
      >
        <Link href={data.path ? data.path : ''}>
          <Tooltip title={data.title} disableInteractive>
            <Box sx={{ display: 'flex' }}>
              <ListItemIcon
                sx={{
                  color: Boolean(router.pathname === data.path)
                    ? '#fff !important'
                    : `rgba(${theme.palette.customColors.main},0.78)`
                }}
              >
                <CustomIcon icon={data.icon} />
              </ListItemIcon>

              <StyledListItemText
                primary={data.title}
                sx={{ ml: '3px' }}
                active={Boolean(router.pathname === data.path)}
              ></StyledListItemText>
            </Box>
          </Tooltip>
        </Link>

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
              <ItemVerticalLayout data={item} level={level + 1} openVertical={openVertical} />
            </Collapse>
          )
        })}
    </>
  )
}
