// ** React
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Box, Divider, IconButton, Tooltip, useTheme } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

// ** Component
import CustomIcon from 'src/components/Icon'

// ** Config
import { OBJECT_STAR_PRODUCT } from 'src/configs/products'

type TFilterProduct = {
  valueReview: string
  valueCities: string
  onChange: (value: string, name: string) => void
  dataCities: { label: string; value: string }[]
  deleteAll: () => void
}

export default function FilterProduct({ onChange, valueReview, valueCities, dataCities, deleteAll }: TFilterProduct) {
  const { t } = useTranslation()
  const objectStar = OBJECT_STAR_PRODUCT()
  const theme = useTheme()

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title={t('Delete_all')}>
          <IconButton onClick={deleteAll}>
            <CustomIcon icon='mingcute:delete-2-fill' />
          </IconButton>
        </Tooltip>
      </Box>
      <FormControl>
        <FormLabel id='demo-radio-buttons-group-label' sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
          {t('Review')}
        </FormLabel>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          value={valueReview}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value, 'review')
          }}
          name='radio-buttons-group'
        >
          {Object.values(objectStar).map(item => {
            return (
              <FormControlLabel
                checked={Number(valueReview) === item.value}
                value={item.value}
                control={<Radio />}
                label={item.label}
                key={item.value}
              />
            )
          })}
        </RadioGroup>
      </FormControl>
      <Divider />
      <Box sx={{ mt: 5 }}>
        <FormControl>
          <FormLabel id='demo-radio-buttons-group-label' sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            {t('City')}
          </FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            value={valueCities}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value, 'city')
            }}
            name='radio-buttons-group'
          >
            {dataCities.map(item => {
              return (
                <FormControlLabel
                  checked={valueCities === item.value}
                  value={item.value}
                  control={<Radio />}
                  label={item.label}
                  key={item.value}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Box>
    </>
  )
}
