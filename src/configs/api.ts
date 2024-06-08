export const BASE_URL = `${process.env.NEXT_PUBLIC_API_HOST}/api`

export const API_ENDPOINT = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  },
  SYSTEM: {
    ROLE: {
      INDEX: `${BASE_URL}/roles`
    },
    USERS: {
      INDEX: `${BASE_URL}/users`
    }
  },
  SETTINGS: {
    CITY: {
      INDEX: `${BASE_URL}/city`
    },
    DELIVERY_TYPE: {
      INDEX: `${BASE_URL}/delivery-type`
    },
    PAYMENT_TYPE: {
      INDEX: `${BASE_URL}/payment-type`
    }
  },
  MANAGE_PRODUCT: {
    PRODUCT_TYPES: {
      INDEX: `${BASE_URL}/product-types`
    },
    PRODUCTS: {
      INDEX: `${BASE_URL}/products`
    }
  },

  MANAGE_ORDER: {
    ORDER: {
      INDEX: `${BASE_URL}/orders`
    }
  }
}
