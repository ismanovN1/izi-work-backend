import Router from 'express'
import controllers from '../controllers/index.js'
import {auth_middleware} from '../middlewares/auth.middleware.js'

const respond_router = new Router()

respond_router.post('/create-message',auth_middleware ,controllers.chat.create_message )
respond_router.get('/get-messages',auth_middleware ,controllers.chat.get_messages )
respond_router.get('/get-chat',auth_middleware ,controllers.chat.get_chat )
respond_router.get('/get-my-chats',auth_middleware ,controllers.chat.get_my_chats )
respond_router.get('/user-is-online',auth_middleware ,controllers.chat.get_user_status )



export default respond_router;