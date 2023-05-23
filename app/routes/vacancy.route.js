import Router from 'express'
import controllers from '../controllers/index.js'
import {auth_middleware, auth_middleware_employer} from '../middlewares/auth.middleware.js'

const vacancy_router = new Router()

vacancy_router.get('/', controllers.vacancy.get_vacancies )
vacancy_router.get('/my-vacancies/:id',auth_middleware_employer ,controllers.vacancy.get_my_vacancy_by_id )
vacancy_router.get('/my-vacancies',auth_middleware_employer ,controllers.vacancy.get_my_vacancies )
vacancy_router.get('/:id',controllers.vacancy.get_vacancy_by_id )
vacancy_router.post('/',auth_middleware_employer ,controllers.vacancy.create_vacancy )
vacancy_router.put('/:id',auth_middleware_employer ,controllers.vacancy.update_vacancy )
vacancy_router.delete('/:id',auth_middleware_employer ,controllers.vacancy.delete_vacancy_by_id )


export default vacancy_router;