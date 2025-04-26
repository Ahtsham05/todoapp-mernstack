import dashboardRoute from './dashboard.route.js'
import todoRoute from './todo.route.js'
import userRoute from './user.route.js'
import authRoute from './auth.route.js'
import docsRoute from './docs.route.js'
import { Router } from 'express'

const router = Router()

// routes.forEach ✅
const routes = [
    { route: 'todos', handler: todoRoute },
    { route: 'user', handler: userRoute },
    { route: 'dashboard', handler: dashboardRoute },
    { route: 'auth', handler: authRoute },
    { route: 'docs', handler: docsRoute}
];


routes.forEach(({ route, handler }) => {
    router.use(`/${route}`, handler);
});


export default router

