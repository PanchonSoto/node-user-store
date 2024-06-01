import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError } from '../../domain';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { EmailService } from './email.service';



export class AuthService {
    
    constructor(
        private readonly emailSvc: EmailService
    ){}

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            
            //encript pass
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();
            
            //jwt token
            const token = await JwtAdapter.generateToken({id: user.id, email: user.email});
            if(!token) throw CustomError.internalServer('Error while creating TOKEN');
            
            //confirmation email
            await this.sendValidationEmail(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                ...userEntity,
                token
            };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    public async loginUser(loginUserDto: LoginUserDto) {

        try {
            //findone to database
            const existUser = await UserModel.findOne({email: loginUserDto.email});
            if(!existUser) throw CustomError.badRequest('User does not exist');

            //verify that password matched
            const match = bcryptAdapter.compare(loginUserDto.password, existUser.password);
            if(!match) throw CustomError.badRequest('Incorrect credentials');

            const {password, ...userEntity} = UserEntity.fromObject(existUser);

            const token = await JwtAdapter.generateToken({id: existUser.id, email: existUser.email});
            if(!token) throw CustomError.internalServer('Error while creating TOKEN');

                    
            return {
                userEntity,
                token
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    private sendValidationEmail = async (email:string) => {
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalServer('Error gettin token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate</p>
            <a href="${link}">Validate your email ${email}</a>
        `;
        const options = {
            to: email,
            subject: 'Email confirmation',
            htmlBody: html,
        }
        const isSet = await this.emailSvc.sendEmail(options);
        if(!isSet) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async(token:string) => {
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email:string };
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({email});
        if(!user) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();
        
        return true;
    } 
}
