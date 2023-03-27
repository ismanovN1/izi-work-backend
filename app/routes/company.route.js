import Router from 'express'
import controllers from '../controllers/index.js'
import {auth_middleware} from '../middlewares/auth.middleware.js'

const company_router = new Router()

company_router.get('/',auth_middleware ,controllers.company.get_my_company )
company_router.get('/:id',controllers.company.get_company_by_id )
company_router.post('/create',auth_middleware ,controllers.company.create_company )
company_router.put('/update/:id',auth_middleware ,controllers.company.update_company )
company_router.delete('/delete/:id',auth_middleware ,controllers.company.delete_company_by_id )


export default company_router;