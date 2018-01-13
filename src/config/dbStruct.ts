export default {
  area: {
    city: '城市',
  },
  order: {
    treasure_id: {
      table: 'treasure',
      link: 'name',
    },
    person_id: {
      table: 'person',
      link: 'name',
    },
    unit_price: '单价',
    quantity: '数量',
    status_id: {
      table: 'status',
      link: 'status',
    },
    final_price: '确定总价',
  },
  person: {
    name: '订购人',
    area_id: {
      table: 'area',
      link: 'city',
    },
    nickname: '别称',
    address: '地址',
  },
  status: {
    status: '状态',
  },
  treasure: {
    name: '法宝',
    default_price: '初始价',
  },
};
