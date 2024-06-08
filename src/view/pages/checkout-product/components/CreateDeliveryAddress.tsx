// ** React
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme
} from '@mui/material'

// ** Components
import CustomIcon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'

// **Form
import { Controller, useForm } from 'react-hook-form'

// **Yup
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'

// ** Store
import { AppDispatch, RootState } from 'src/stores'

// ** i18next

// ** Components
import { CustomSelect } from 'src/components/custom-select'
import Spinner from 'src/components/spinner'
import NoData from 'src/components/no-data'

// ** Configs

// ** Utils
import { separationFullName, toFullName } from 'src/utils'

// ** Services
import { getAllCity } from 'src/services/city'
import { updateAuthMeSync } from 'src/stores/auth/actions'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { resetInitialState } from 'src/stores/auth'

type TDefaultValue = {
  fullName: string
  phoneNumber: string
  address: string
  city: string
}

type TAddresses = {
  firstName: string
  lastName: string
  middleName: string
  phoneNumber: string
  address: string
  city: string
  isDefault: boolean
}

interface TCreateDeliveryAddress {
  open: boolean
  onClose: () => void
  tabActiveDefault: number
}

export const CreateDeliveryAddress = ({ open, onClose, tabActiveDefault }: TCreateDeliveryAddress) => {
  // ** Hook
  const theme = useTheme()

  // ** Translation
  const { t, i18n } = useTranslation()

  // ** User
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [checkboxSelected, setCheckboxSelected] = useState(0)
  const [tabActive, setTabActive] = useState(0)
  const [allCity, setAllCity] = useState<{ label: string; value: string }[]>([])
  const [addresses, setAddresses] = useState<TAddresses[]>(user?.addresses)
  const [isEditItem, setIsEditItem] = useState({
    isEdit: false,
    index: 0
  })

  const { isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe } = useSelector((state: RootState) => state.auth)

  // ** Redux
  const dispatch: AppDispatch = useDispatch()

  const defaultValues: TDefaultValue = {
    fullName: '',
    phoneNumber: '',
    city: '',
    address: ''
  }

  const schema = yup.object({
    fullName: yup.string().required('Please enter full name'),
    phoneNumber: yup.string().required('Please enter phone number').min(8, 'The number phone is min 8 number'),
    city: yup.string().required('Please enter city'),
    address: yup.string().required('Please enter address')
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const handleOnSubmit = (data: TDefaultValue) => {
    if (tabActive === 2) {
      const { firstName, lastName, middleName } = separationFullName(data.fullName, i18n.language)
      const isHaveDefault = addresses.length > 0 ? addresses.some(item => item.isDefault) : false
      if (isEditItem.isEdit) {
        // clone address to avoid change data because the same reference.
        const cloneAddresses = [...addresses]
        const findAddress = cloneAddresses[isEditItem.index]
        if (findAddress) {
          ;(findAddress.firstName = firstName),
            (findAddress.lastName = lastName),
            (findAddress.middleName = middleName),
            (findAddress.phoneNumber = data.phoneNumber),
            (findAddress.address = data.address),
            (findAddress.city = data.city),
            (findAddress.isDefault = findAddress.isDefault)
        }
        setAddresses(cloneAddresses)
        setIsEditItem({
          isEdit: false,
          index: -1
        })
      } else {
        setAddresses([
          ...addresses,
          {
            firstName,
            lastName,
            middleName,
            phoneNumber: data.phoneNumber,
            address: data.address,
            city: data.city,
            isDefault: !isHaveDefault
          }
        ])
      }
      reset({
        ...defaultValues
      })
      setTabActive(1)
    }
  }

  const handleSelectedCheckbox = (value: string) => {
    const cloneAddresses = [...addresses]
    const changeDefault = cloneAddresses.map((item, index) => ({
      ...item,
      isDefault: +value === index
    }))
    setAddresses(changeDefault)
    setCheckboxSelected(Number(value))
  }

  const handleUpdateAddressesMe = () => {
    dispatch(
      updateAuthMeSync({
        ...user,
        addresses: [...addresses]
      })
    )
    onClose()
  }

  const fetchAllCity = async () => {
    setLoading(true)
    try {
      setLoading(false)

      const response = await getAllCity({ params: { limit: -1, page: -1 } })
      const CityArr = response?.data?.cities.map((item: any) => ({
        label: item.name,
        value: item._id
      }))

      setAllCity(CityArr)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllCity()
  }, [])

  useEffect(() => {
    const findIndex = user?.addresses.findIndex((item: TAddresses) => item.isDefault)
    setCheckboxSelected(findIndex)
  }, [user])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
      }

      dispatch(resetInitialState())
    }
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  useEffect(() => {
    if (isEditItem.isEdit) {
      const addressItem = addresses[isEditItem.index]
      const fullName = toFullName(addressItem.lastName, addressItem.middleName, addressItem.firstName, i18n.language)
      const findCity = allCity.find(item => item.value === addressItem.city)

      reset({
        fullName,
        address: addressItem ? addressItem.address : '',
        city: findCity ? findCity.value : '',
        phoneNumber: addressItem ? addressItem.phoneNumber : ''
      })
    }
  }, [isEditItem])

  return (
    <CustomModal open={open}>
      <>
        {loading && <Spinner />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose}>
            <CustomIcon icon='typcn:delete' />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleOnSubmit)} autoComplete='off' noValidate>
          <Box sx={{ background: theme.palette.background.paper, borderRadius: '15px', px: 4, py: 5 }}>
            {tabActive === 2 ? (
              <Grid container>
                <Grid width='100%'>
                  <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }} variant='h3'>
                    {t('Add_address')}
                  </Typography>
                </Grid>
                <Grid container item md={12} xs={12} mt={{ md: 0, xs: 5 }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      background: theme.palette.background.paper,
                      borderRadius: '15px',
                      px: 4,
                      py: 5
                    }}
                    marginLeft={{ md: 5, xs: 0 }}
                  >
                    <Grid container spacing={4}>
                      <Grid item md={6} xs={12}>
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
                                label={t('Full_name')}
                                placeholder={t('Enter_your_full_name')}
                                inputRef={ref}
                                error={Boolean(errors.fullName)}
                                helperText={errors.fullName?.message}
                              />
                            )}
                            name='fullName'
                          />
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Box mt={2}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                              <CustomTextField
                                onChange={e => {
                                  const numValue = e.target.value.replace(/\D/g, '')
                                  onChange(numValue)
                                }}
                                inputProps={{
                                  pattern: '[0-9]*',
                                  inputMode: 'numeric'
                                }}
                                onBlur={onBlur}
                                value={value}
                                fullWidth
                                label={t('Phone_number')}
                                placeholder={t('Enter_your_phone')}
                                inputRef={ref}
                                error={Boolean(errors.phoneNumber)}
                                helperText={errors.phoneNumber?.message}
                              />
                            )}
                            name='phoneNumber'
                          />
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
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
                                label={t('Address')}
                                placeholder={t('Enter_your_address')}
                                inputRef={ref}
                                error={Boolean(errors.address)}
                                helperText={errors.address?.message}
                              />
                            )}
                            name='address'
                          />
                        </Box>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Box mt={2}>
                          <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                              <Box>
                                <InputLabel
                                  sx={{
                                    fontSize: '13px',
                                    mb: '4px'
                                  }}
                                >
                                  {t('City')}
                                </InputLabel>
                                <CustomSelect
                                  fullWidth
                                  onChange={onChange}
                                  options={allCity}
                                  value={value}
                                  placeholder={t('Enter_your_city')}
                                  inputRef={ref}
                                  error={Boolean(errors.city)}
                                />
                                {Boolean(errors.city) && (
                                  <FormHelperText
                                    sx={{
                                      color: `${theme.palette.error.main} !important`
                                    }}
                                  >
                                    {t('Enter_your_city')}
                                  </FormHelperText>
                                )}
                              </Box>
                            )}
                            name='city'
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <>
                {addresses.length > 0 ? (
                  <>
                    <Box>
                      <Typography sx={{ fontWeight: 'bold', textAlign: 'center' }} variant='h3'>
                        {t('Delivery_address')}
                      </Typography>
                    </Box>
                    <FormControl sx={{ marginTop: '15px' }}>
                      <FormLabel
                        id='demo-radio-buttons-group-label'
                        sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
                      >
                        {t('Enter_your_address')}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby='demo-radio-buttons-group-label'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          handleSelectedCheckbox(e.target.value)
                        }}
                        name='radio-buttons-group'
                      >
                        {addresses.map((item, index) => {
                          const findCity = allCity.find(itemCity => itemCity.value === item.city)

                          return (
                            <Box sx={{ display: 'flex' }} key={index}>
                              <FormControlLabel
                                checked={checkboxSelected === index}
                                value={index}
                                control={<Radio />}
                                label={`${toFullName(
                                  item?.lastName,
                                  item?.middleName,
                                  item?.firstName,
                                  i18n.language
                                )}, ${item.phoneNumber}, ${findCity?.label}, ${item.address}`}
                                key={index}
                              />

                              {item.isDefault && (
                                <Button
                                  type='submit'
                                  variant='outlined'
                                  sx={{ mt: 3, mb: 2 }}
                                  onClick={() => {
                                    setTabActive(2)
                                    setIsEditItem({
                                      isEdit: true,
                                      index: index
                                    })
                                  }}
                                >
                                  {t('Change_address')}
                                </Button>
                              )}
                            </Box>
                          )
                        })}
                      </RadioGroup>
                    </FormControl>
                  </>
                ) : (
                  <Box sx={{ px: 4, py: 5 }}>
                    <NoData widthImage={400} heightImage={80} textImage='No_data' />
                  </Box>
                )}
                <Box>
                  <Button
                    variant='outlined'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => {
                      addresses.length <= 2 && setTabActive(2), reset()
                    }}
                  >
                    {t('Add_new')}
                  </Button>
                </Box>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {tabActive === 2 && (
              <Button
                variant='outlined'
                sx={{ mt: 3, mb: 2 }}
                onClick={() => {
                  setTabActive(1)
                  reset({
                    ...defaultValues
                  })
                  setIsEditItem({
                    isEdit: false,
                    index: -1
                  })
                }}
              >
                {t('Cancel')}
              </Button>
            )}
            {tabActive === 2 ? (
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {t('Submit')}
              </Button>
            ) : (
              <Button variant='contained' sx={{ mt: 3, mb: 2 }} onClick={handleUpdateAddressesMe}>
                {t('Update')}
              </Button>
            )}
          </Box>
        </form>
      </>
    </CustomModal>
  )
}
