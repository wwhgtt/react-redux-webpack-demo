module.exports = {
  path:'/booking/getTables.json',
  template:{
    code: 200,
    msg:'',
    data:{
      areaList: [
        {
          areaId: 17604,
          areaName: '里面',
          tableInfoList: [
            {
              pNum: 4,
              count: 6,
            },
            {
              pNum: 8,
              count: 3,
            },
          ],
        },
        {
          areaId: 18554,
          areaName: 'test',
          tableInfoList: [
            {
              pNum: 4,
              count: 6,
            },
          ],
        },
        {
          areaId: 18653,
          areaName: '区域一',
          tableInfoList: [
            {
              pNum: 4,
              count: 4,
            },
          ],
        },
        {
          areaId: 18654,
          areaName: '区域二',
          tableInfoList: [
            {
              pNum: 4,
              count: 4,
            },
          ],
        },
        {
          areaId: 8836,
          areaName: '大厅区',
          tableInfoList: [
            {
              pNum: 4,
              count: 13,
            },
            {
              pNum: 6,
              count: 3,
            },
            {
              pNum: 7,
              count: 1,
            },
          ],
        },
      ],
    },
  },
};
