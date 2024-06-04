import { NextFunction, Request, Response } from "express";

import { JwtAdapter } from "../../config";
import { UserEntity } from "../../domain";
import { UserModel } from "../../data";



export class AuthMiddleware {

    static async validateJWT(req:Request, res:Response, next: NextFunction) {

        const authorization = req.header('Authorization');
        if(!authorization) return res.status(401).json({error: 'No token provider'});
        if(!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Invalid Bearer token'});

        const token = authorization.split(' ').at(1) || '';

        try {
            const payload = await JwtAdapter.validateToken<{id: string}>(token);
            if(!payload) return res.status(401).json({error:'Invalid token'});

            const user = await UserModel.findById(payload.id);
            if(!user) return res.status(401).json({error:'Invalid token-user'});

            //todo validate if user is active

            req.body.user = UserEntity.fromObject(user);
            next();
            
        } catch (error) {
            console.log(error);
            res.status(500).json({error: 'Internal server error', strErr:JSON.stringify(error)});
        }
    }

}
