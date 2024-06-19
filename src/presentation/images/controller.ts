import fs from 'fs';
import path from 'path';

import { Request, Response } from "express";



export class ImageController {

    constructor(){}

    

    getImage=(req:Request, response:Response) => {

        const {type='', img=''} = req.params;

        const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

        if(!fs.existsSync(imagePath)) {
            return response.status(404).send('Image not found');
        }

        response.sendFile(imagePath);

    }

}
