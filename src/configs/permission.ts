const CONFIG_MESSAGE_ERRORS = {
  INVALID: {
    type: 'INVALID',
    status: 400
  },
  ALREADY_EXIST: {
    type: 'ALREADY_EXIST',
    status: 409
  },
  GET_SUCCESS: {
    type: 'SUCCESS',
    status: 200
  },
  ACTION_SUCCESS: {
    type: 'SUCCESS',
    status: 201
  },
  UNAUTHORIZED: {
    type: 'UNAUTHORIZED',
    status: 401
  },
  INTERNAL_ERROR: {
    type: 'INTERNAL_SERVER_ERROR',
    status: 500
  }
}

export const CONFIG_PERMISSIONS: any = {
  ADMIN: 'ADMIN.GRANTED',
  BASIC: 'BASIC.PUBLIC',
  DASHBOARD: 'DASHBOARD',
  MANAGE_PRODUCT: {
    PRODUCT: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT.DELETE',
      VIEW: 'MANAGE_PRODUCT.PRODUCT.VIEW'
    },
    PRODUCT_TYPE: {
      CREATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.CREATE',
      UPDATE: 'MANAGE_PRODUCT.PRODUCT_TYPE.UPDATE',
      DELETE: 'MANAGE_PRODUCT.PRODUCT_TYPE.DELETE'
    },
    COMMENT: {
      UPDATE: 'MANAGE_PRODUCT.COMMENT.UPDATE',
      DELETE: 'MANAGE_PRODUCT.COMMENT.DELETE'
    }
  },
  SYSTEM: {
    USER: {
      VIEW: 'SYSTEM.USER.VIEW',
      CREATE: 'SYSTEM.USER.CREATE',
      UPDATE: 'SYSTEM.USER.UPDATE',
      DELETE: 'SYSTEM.USER.DELETE'
    },
    ROLE: {
      VIEW: 'SYSTEM.ROLE.VIEW',
      CREATE: 'SYSTEM.ROLE.CREATE',
      UPDATE: 'SYSTEM.ROLE.UPDATE',
      DELETE: 'SYSTEM.ROLE.DELETE'
    }
  },
  MANAGE_ORDER: {
    REVIEW: {
      UPDATE: 'MANAGE_ORDER.REVIEW.UPDATE',
      DELETE: 'MANAGE_ORDER.REVIEW.DELETE'
    },
    ORDER: {
      VIEW: 'MANAGE_ORDER.ORDER.VIEW',
      UPDATE: 'MANAGE_ORDER.ORDER.UPDATE',
      DELETE: 'MANAGE_ORDER.ORDER.DELETE'
    }
  },
  SETTING: {
    PAYMENT_TYPE: {
      CREATE: 'SETTING.PAYMENT_TYPE.CREATE',
      UPDATE: 'SETTING.PAYMENT_TYPE.UPDATE',
      DELETE: 'SETTING.PAYMENT_TYPE.DELETE'
    },
    DELIVERY_TYPE: {
      CREATE: 'SETTING.DELIVERY_TYPE.CREATE',
      UPDATE: 'SETTING.DELIVERY_TYPE.UPDATE',
      DELETE: 'SETTING.DELIVERY_TYPE.DELETE'
    },
    CITY: {
      CREATE: 'CITY.CREATE',
      UPDATE: 'CITY.UPDATE',
      DELETE: 'CITY.DELETE'
    }
  }
}

const CONFIG_USER_TYPE = {
  FACEBOOK: 1,
  GOOGLE: 2,
  DEFAULT: 3
}

const PAYMENT_TYPES = {
  PAYMENT_LATER: 'PAYMENT_LATER',
  VN_PAYMENT: 'VN_PAYMENT',
  PAYPAL: 'PAYPAL'
}

const CONTEXT_NOTIFICATION = {
  ORDER: 'ORDER',
  PAYMENT_VN_PAY: 'PAYMENT_VN_PAY'
}

const ACTION_SOCKET_COMMENT = {
  CREATE_COMMENT: 'CREATE_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_MULTIPLE_COMMENT: 'DELETE_MULTIPLE_COMMENT',
  REPLY_COMMENT: 'REPLY_COMMENT'
}

const ACTION_NOTIFICATION_ORDER = {
  CREATE_ORDER: 'Create_order',
  CANCEL_ORDER: 'Cancel_order',
  WAIT_PAYMENT: 'Wait_payment',
  WAIT_DELIVERY: 'Wait_delivery',
  DONE_ORDER: 'Done_order',
  IS_DELIVERED: 'Is_delivered',
  IS_PAID: 'Is_paid',
  PAYMENT_VN_PAY_SUCCESS: 'Payment_vn_pay_success',
  PAYMENT_VN_PAY_ERROR: 'Payment_vn_pay_error'
}

export const LIST_DATA_PERMISSIONS: any = [
  {
    id: 14,
    name: 'Dashboard',
    value: 'DASHBOARD',
    isParent: false,
    isHideCreate: true,
    isHideUpdate: true,
    isHideDelete: true,
    isHideAll: true
  },
  {
    id: 1,
    name: 'manage-product',
    isParent: true,
    value: 'MANAGE_PRODUCT'
  },
  {
    id: 2,
    name: 'product',
    isParent: false,
    value: 'PRODUCT',
    parentValue: 'MANAGE_PRODUCT'
  },
  {
    id: 3,
    name: 'product-type',
    isParent: false,
    value: 'PRODUCT_TYPE',
    parentValue: 'MANAGE_PRODUCT',
    isHideView: true
  },
  {
    id: 4,
    name: 'system',
    isParent: true,
    value: 'SYSTEM'
  },
  {
    id: 5,
    name: 'user',
    isParent: false,
    value: 'USER',
    parentValue: 'SYSTEM'
  },
  {
    id: 6,
    name: 'role',
    isParent: false,
    value: 'ROLE',
    parentValue: 'SYSTEM'
  },
  {
    id: 7,
    name: 'manage-order',
    isParent: true,
    value: 'MANAGE_ORDER'
  },
  {
    id: 8,
    name: 'review',
    isParent: false,
    isHideView: true,
    isHideCreate: true,
    value: 'REVIEW',
    parentValue: 'MANAGE_ORDER'
  },
  {
    id: 9,
    name: 'order',
    isParent: false,
    value: 'ORDER',
    parentValue: 'MANAGE_ORDER',
    isHideCreate: true
  },
  {
    id: 10,
    name: 'setting',
    isParent: true,
    value: 'SETTING'
  },
  {
    id: 11,
    name: 'payment-type',
    isParent: false,
    isHideView: true,
    value: 'PAYMENT_TYPE',
    parentValue: 'SETTING'
  },
  {
    id: 12,
    name: 'delivery-type',
    isParent: false,
    isHideView: true,
    value: 'DELIVERY_TYPE',
    parentValue: 'SETTING'
  },
  {
    id: 13,
    name: 'city',
    isParent: false,
    isHideView: true,
    value: 'CITY',
    parentValue: 'SETTING'
  }
]

module.exports = {
  CONFIG_MESSAGE_ERRORS,
  CONFIG_PERMISSIONS,
  CONFIG_USER_TYPE,
  PAYMENT_TYPES,
  CONTEXT_NOTIFICATION,
  ACTION_SOCKET_COMMENT,
  ACTION_NOTIFICATION_ORDER,
  LIST_DATA_PERMISSIONS
}
