import spb_31 from './spb_31'
export const MockedAPIResultSpb31 = spb_31.map(data => {
  if (data.result === 'error') {
    data.date = new Date(data.date)
  }
  return data
})

export const MockedAPIResultSpb120 = MockedAPIResultSpb31.concat(MockedAPIResultSpb31).concat(MockedAPIResultSpb31).concat(MockedAPIResultSpb31)

export const MockedAPICities = [{
    "id": 1,
    "name": "Ангарск",
    "code": "2054260",
    "caps_name": "АНГАРСК",
    "created_at": "2019-06-27T10:42:57.205Z",
    "updated_at": "2019-06-27T10:42:57.205Z"
}, {
    "id": 15,
    "name": "Волгоград",
    "code": "2020500",
    "caps_name": "ВОЛГОГРАД 1",
    "created_at": "2019-06-27T10:42:57.258Z",
    "updated_at": "2019-06-27T10:42:57.258Z"
}]
