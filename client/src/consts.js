let api_base = 'http://localhost:3000'
if (process.env.REACT_APP_RELEASE)
  api_base = 'https://www.strelchka.ru'
else if (process.env.REACT_APP_PRERELEASE)
  api_base = 'https://staging.strelchka.ru'
else if (process.env.REACT_APP_LOCALRELEASE)
  api_base = 'http://localhost:3001'

let api_base_com = 'http://localhost:3000'
if (process.env.REACT_APP_RELEASE)
  api_base_com = 'https://www.strelochka.com'
else if (process.env.REACT_APP_PRERELEASE)
  api_base_com = 'https://staging.strelochka.com'


export const API_BASE = api_base
export const API_BASE_COM = api_base_com
