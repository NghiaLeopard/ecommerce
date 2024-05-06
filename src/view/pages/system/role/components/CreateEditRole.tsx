// ** Next

// ** MUI
import { Button } from '@mui/material'
import { Box, useTheme } from '@mui/material'

// ** Components
import CustomTextField from 'src/components/text-field'
import CustomModal from 'src/components/custom-modal'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole: string
}

const schema = yup.object({
  name: yup.string().required('Please choose name')
})

export const CreateEditRole = ({ open, onClose, idRole }: TCreateEditRole) => {
  const theme = useTheme()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: { name: string }) => {}

  return (
    <CustomModal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
        <Box mt={2} width='300px'>
          <Controller
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <CustomTextField
                required
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                fullWidth
                label='Name'
                inputRef={ref}
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
              />
            )}
            name='name'
          />
        </Box>

        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
      </form>
    </CustomModal>
  )
}
