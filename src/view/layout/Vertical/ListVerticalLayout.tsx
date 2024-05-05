// ** Next
import { NextPage } from 'next'

// ** Mui
import List from '@mui/material/List'

// ** layout
import { VerticalItems } from 'src/configs/layout'

// component
import { ItemVerticalLayout } from './ItemVerticalLayout'

interface TProps {
  openVertical: boolean
}

export const ListVerticalLayout: NextPage<TProps> = ({ openVertical }) => {
  const level = 0

  return (
    <>
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', padding: 0 }}
        component='nav'
        aria-labelledby='nested-list-subheader'
      >
        {VerticalItems.map(item => {
          return (
            <li key={item.title}>
              <ItemVerticalLayout data={item} level={level} openVertical={openVertical} />
            </li>
          )
        })}
      </List>
    </>
  )
}
