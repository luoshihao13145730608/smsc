import { getParams } from '@/libs/util'
const USER_MAP = {
  token: 'super_admin',
  nick_name: 'super_admin',
  access: ['ROLE_ADMIN'],
  avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
  admin: {
    name: 'admin',
    user_id: '2',
    access: ['admin'],
    token: 'admin',
    avatar: 'https://avatars0.githubusercontent.com/u/20942571?s=460&v=4'
  }
}

export const login = req => {
  return USER_MAP
}

export const getUserInfo = req => {
  const params = getParams(req.url)
  return USER_MAP[params.token]
}

export const logout = req => {
  return null
}
