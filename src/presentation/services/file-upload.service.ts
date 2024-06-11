


export class FileUploadService {

    constructor(

    ){}


    private checkFolder(folderPath: string){
        throw new Error('Not implemented');
    }


    uploadSingle(
        file: any,
        folder: string = 'uploads',
        validExtension: string[] = ['png','jpg','jpeg','gif']
    ){

    }

    uploadMultiple(
        file: any[],
        folder: string = 'uploads',
        validExtension: string[] = ['png','jpg','jpeg','gif']
    ){

    }
}
