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

  '.react-multi-carousel-dot': {
    button: {
      borderColor: `${theme.palette.primary.main} !important`
    },
    '&.react-multi-carousel-dot--active': {
      button: {
        background: `${theme.palette.primary.main} !important`
      }
    }
  }
}))
export const CustomCarousel = (props: TProps) => {
  const { responsive: responsiveProps, children, ...rests } = props

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  }

  return (
    <StyleCarousel responsive={responsiveProps || responsive} {...rests}>
      {children}
    </StyleCarousel>
  )
}
