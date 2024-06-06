import { Request, Response, NextFunction } from "express";



export const esAdminRole = (req: Request, res: Response, next: NextFunction) => {
 
    if(!req.body.user){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }
 
    const {role, name} = req.body.user;
 
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} no es administrador - No puede hacer esto`
        });
    }
 
    next();
 
}
