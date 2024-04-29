// ** Next
import { NextPage } from 'next'

// ** Mui
import { Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

// ** React
import { useState } from 'react'

// Custom
import CustomIcon from 'src/components/Icon'

type TProps = {
  data: any
  level: number
  openVertical: boolean
}

// each one component will have useState and event handle difference.
export const ItemVerticalLayout: NextPage<TProps> = ({ data, level, openVertical }) => {
  const [open, setOpen] = useState(false)

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
        sx={{ padding: ` 8px 20px 8px ${level === 0 ? 13 : level * 25}px` }}
      >
        <ListItemIcon>
          <CustomIcon icon={data.icon} />
        </ListItemIcon>
        <ListItemText primary={data.title} sx={{ ml: '3px' }} />
        {data.children && (open ? <CustomIcon icon='mdi:expand-less' /> : <CustomIcon icon='mdi:expand-more' />)}
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
