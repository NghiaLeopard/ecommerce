// ** React
import { useEffect } from 'react'

// ** MUI
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import * as yup from 'yup'

// ** Store
import { getDetailRole } from 'src/services/role'
import { AppDispatch } from 'src/stores'
import { createRolesAsync, editRolesAsync } from 'src/stores/roles/actions'

// ** i18next
import { t } from 'i18next'

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
  const dispatch: AppDispatch = useDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: { name: string }) => {
    if (!idRole) {
      dispatch(createRolesAsync({ name: data?.name, permissions: [] }))
    } else {
      dispatch(editRolesAsync({ name: data?.name, permissions: [], idRole: idRole }))
    }
  }

  const fetchDetailRole = async (idRole: string) => {
    const res = await getDetailRole(idRole)
    const data = res.data
    if (data) {
      reset({
        name: data?.name
      })
    }
  }

  useEffect(() => {
    if (!open) {
      reset({ name: '' })
    } else if (idRole) {
      fetchDetailRole(idRole)
    }
  }, [open, idRole])

  return (
    <CustomModal open={open} onClose={onClose}>
      <Box
        sx={{ backgroundColor: `${theme.palette.background.paper} !important`, borderRadius: '15px', padding: '30px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h3' sx={{ fontWeight: 600 }}>
            {idRole ? t('Edit_role') : t('Create_role')}
          </Typography>
          <IconButton onClick={onClose}>
            <CustomIcon icon='typcn:delete' />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          <Box mt={2} width='350px'>
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
                  label={t('Name_role')}
                  inputRef={ref}
                  placeholder={t('Enter_your_role')}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              )}
              name='name'
            />
          </Box>

          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            {idRole ? t('Update') : t('Create')}
          </Button>
        </form>
      </Box>
    </CustomModal>
  )
}
