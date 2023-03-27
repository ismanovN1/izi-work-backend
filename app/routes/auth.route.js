import Router from 'express'
import controllers from '../controllers/index.js'
import { auth_middleware } from '../middlewares/auth.middleware.js'

const auth_router = new Router()

auth_router.post('/registration', controllers.auth.registration )
auth_router.post('/sign-in', controllers.auth.authorization)
auth_router.put('/edit-user', auth_middleware, controllers.auth.edit_user_data)
auth_router.put('/change-password', auth_middleware, controllers.auth.change_user_password)



export default auth_router;