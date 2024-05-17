// ** Type Import
import { OwnerStateThemeType } from '.'

const input = () => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -8px) scale(0.75)'
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.28)`
          },
          '&.Mui-disabled:before': {
            borderBottomStyle: 'solid'
          }
        })
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: ({ theme }: OwnerStateThemeType) => ({
          '&:not(.MuiInputBase-sizeSmall)': {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8
          },
          backgroundColor: `rgba(${theme.palette.customColors.main}, 0.04)`,
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: `rgba(${theme.palette.customColors.main}, 0.08)`
          },
          '&:before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.2)`
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid rgba(${theme.palette.customColors.main}, 0.28)`
          }
        })
      }
    },

    // Radio, Checkbox & Switch
    MuiFormControlLabel: {
      styleOverrides: {
        label: ({ theme }: OwnerStateThemeType) => ({
          color: theme.palette.text.secondary
        })
      }
    }
  }
}

export default input
