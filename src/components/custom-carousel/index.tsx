import { styled } from '@mui/material'
import { ReactNode } from 'react'
import Carousel, { CarouselProps } from 'react-multi-carousel'

interface TProps extends CarouselProps {
  children: ReactNode
}

const StyleCarousel = styled(Carousel)<CarouselProps>(({ theme }) => ({
  '.react-multi-carousel-track ': {
    gap: '10px'
  },
  '.react-multiple-carousel__arrow': {
    backgroundColor: `${theme.palette.primary.main} !important`
  },

  '.react-multi-carousel-dot--active button ': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main
  }
}))
export const CustomCarousel = (props: TProps) => {
  const { responsive: responsiveProps, children, ...rests } = props

  return (
    <StyleCarousel responsive={responsiveProps} {...rests}>
      {children}
    </StyleCarousel>
  )
}
