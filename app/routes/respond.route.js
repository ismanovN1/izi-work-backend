import Router from 'express'
import controllers from '../controllers/index.js'
import {auth_middleware} from '../middlewares/auth.middleware.js'

const respond_router = new Router()

respond_router.post('/respond',auth_middleware ,controllers.respond.respond )
respond_router.get('/respond',auth_middleware ,controllers.respond.get_respond )
respond_router.get('/my-responded-vacancies',auth_middleware ,controllers.respond.get_my_responded_vacancies )
respond_router.get('/responds-by-vacancy-id',auth_middleware ,controllers.respond.get_responds_by_vacancy_id )

respond_router.post('/add-remove-my-favorite-vacancy',auth_middleware ,controllers.respond.add_remove_my_favorite_vacancy )
respond_router.get('/my-favorite-vacancies',auth_middleware ,controllers.respond.get_my_favorite_vacancies )
respond_router.get('/my-favorite-vacancies-ids',auth_middleware ,controllers.respond.get_my_favorite_vacancies_ids )

respond_router.post('/add-remove-my-favorite-resume',auth_middleware ,controllers.respond.add_remove_my_favorite_resume )
respond_router.get('/my-favorite-resumes',auth_middleware ,controllers.respond.get_my_favorite_resumes )
respond_router.get('/my-favorite-resumes-ids',auth_middleware ,controllers.respond.get_my_favorite_resumes_ids )


export default respond_router;