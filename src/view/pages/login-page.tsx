// ** Next
import { NextPage } from 'next'

// ** MUI
import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Typography
} from '@mui/material'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Regex
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'

// ** React
import { useState } from 'react'
import CustomIcon from 'src/components/Icon'

type TProps = {}

const schema = yup
  .object({
    email: yup.string().required('Please enter email').matches(EMAIL_REG, 'The field is must email type'),
    password: yup
      .string()
      .required('Please enter password')
      .matches(PASSWORD_REG, 'the password is contain charactor,special character,number')
  })
  .required()

const LoginPage: NextPage<TProps> = () => {
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(show => !show)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: { email: string; password: string }) => {
    console.log('data', { data })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          <Box mt={2}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CustomTextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  fullWidth
                  label='Email'
                  inputRef={ref}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              )}
              name='email'
            />
          </Box>

          <Box mt={2}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <CustomTextField
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  fullWidth
                  label='Password'
                  inputRef={ref}
                  type={showPassword ? 'text' : 'password'}
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} edge='end'>
                        {showPassword ? (
                          <CustomIcon icon='material-symbols:visibility-outline' />
                        ) : (
                          <CustomIcon icon='material-symbols:visibility-off-outline-rounded' />
                        )}
                      </IconButton>
                    )
                  }}
                />
              )}
              name='password'
            />
          </Box>

          <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default LoginPage
