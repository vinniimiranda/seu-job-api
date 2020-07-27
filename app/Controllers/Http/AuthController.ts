import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Candidate from 'App/Models/Candidate'

export default class AuthController {
  public async register ({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }),
      role: schema.enum(['candidate', 'admin', 'recruiter']),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
      messages: {
        'email.required': 'E-mail is required to register',
        'email.unique': 'E-mail is already in use',
        'role.required': 'Role is required to register'
      }
    })

    const user = await User.create(userDetails)

    if (userDetails.role === 'candidate') {
      await Candidate.create({ userId: user.id })
    }

    return { message: 'Your account has been created.' }
  }

  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7 days',
    })
    return token.toJSON()
  }
}
