/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('register', 'AuthController.register')
Route.get('jobs', 'JobsController.index')
Route.get('jobs/:id', 'JobsController.show')
Route.post('/login', 'AuthController.login')
Route.post('/logout', async ({ auth }) => {
  await auth.use('api').logout()
})

Route.get('users', 'UsersController.index').middleware('auth')
Route.get('candidates/me', 'CandidatesController.show').middleware('auth')
Route.put('candidates/me', 'CandidatesController.update').middleware('auth')

