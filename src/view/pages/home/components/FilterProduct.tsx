import { useTheme } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { OBJECT_STAR_PRODUCT } from 'src/configs/products'

type TFilterProduct = {
  value: string
  onChange: (value: string) => void
}

export default function FilterProduct({ onChange, value }: TFilterProduct) {
  const { t } = useTranslation()
  const objectStar = OBJECT_STAR_PRODUCT()
  const theme = useTheme()

  return (
    <FormControl>
      <FormLabel id='demo-radio-buttons-group-label' sx={{ color: theme.palette.primary.main ,fontWeight: 'bold'}}>
        {t('Review')}
      </FormLabel>
      <RadioGroup
        aria-labelledby='demo-radio-buttons-group-label'
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value)
        }}
        name='radio-buttons-group'
      >
        {Object.values(objectStar).map(item => {
          return <FormControlLabel value={item.value} control={<Radio />} label={item.label} key={item.value} />
        })}
      </RadioGroup>
    </FormControl>
  )
}
