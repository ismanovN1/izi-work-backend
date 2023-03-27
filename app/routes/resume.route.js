import Router from 'express'
import controllers from '../controllers/index.js'
import {auth_middleware} from '../middlewares/auth.middleware.js'

const resume_router = new Router()

resume_router.get('/', controllers.resume.get_resumes )
resume_router.get('/my-resume',auth_middleware ,controllers.resume.get_my_resume )
resume_router.get('/:id',controllers.resume.get_resume_by_id )
resume_router.post('/',auth_middleware ,controllers.resume.create_resume )
resume_router.put('/:id',auth_middleware ,controllers.resume.update_resume )
resume_router.delete('/:id',auth_middleware ,controllers.resume.delete_resume_by_id )


export default resume_router;