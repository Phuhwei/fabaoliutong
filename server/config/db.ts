export const database: { [key: string]: ObjStr } = {
  development: {
    host: 'localhost',
    name: 'fabaoliutong',
    user: 'root',
    password: 'root',
  },
  production: {
    host: 'localhost',
    name: 'fabaoliutong',
    user: 'root',
    password: 'root',
  },
};

export const dbSchema: Obj = {
  area: {
    city: {
      required: true,
      alias: '城市',
    },
  },
  order: {
    person_id: {
      required: true,
      link: {
        table: 'person',
        column: 'name',
      },
    },
    treasure_id: {
      required: true,
      link: {
        table: 'treasure',
        column: 'name',
      },
    },
    unit_price_RMB: {
      required: false,
      alias: '单价(¥)',
    },
    unit_price_CAD: {
      required: true,
      alias: '单价($)',
    },
    quantity: {
      required: true,
      alias: '数量',
    },
    status_id: {
      required: true,
      link: {
        table: 'status',
        column: 'name',
      },
    },
    final_price: {
      required: false,
      alias: '总价($)',
    },
    date: {
      required: false,
      alias: '日期',
    },
  },
  person: {
    name: {
      required: true,
      alias: '订购人',
    },
    area_id: {
      required: true,
      link: {
        table: 'area',
        column: 'city',
      },
    },
    nickname: {
      required: false,
      alias: '昵称',
    },
    address: {
      required: false,
      alias: '地址',
    },
  },
  status: {
    name: {
      required: true,
      alias: '状态',
    },
  },
  treasure: {
    name: {
      required: true,
      alias: '法宝',
    },
    alias: {
      required: false,
      alias: '别称',
    },
    default_price_RMB: {
      required: false,
      alias: '初始价(¥)',
    },
    default_price_CAD: {
      required: true,
      alias: '初始价($)',
    },
  },
};
