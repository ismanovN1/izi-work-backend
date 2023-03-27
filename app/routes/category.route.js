import Router from 'express'
import controllers from '../controllers/index.js'

const category_router = new Router()

category_router.get('/', controllers.category.get_categories )
category_router.post('/', controllers.category.create_category)
category_router.delete('/:id', controllers.category.delete_category)



export default category_router;