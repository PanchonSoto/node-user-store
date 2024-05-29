import { bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError } from '../../domain';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserEntity } from '../../domain/entities/user.entity';



export class AuthService {
    
    constructor(){}

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({email: registerUserDto.email});
        if(existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            
            //encript pass
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();
            
            //jwt token

            //confirmation email

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                ...userEntity,
                token: 'ABC'
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
                    
            return {
                userEntity,
                match
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }
}