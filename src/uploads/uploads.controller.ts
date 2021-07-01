import {Controller, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import * as AWS from 'aws-sdk';

const BUCKET_NAME = "seungseoknumbereats";


@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        AWS.config.update({
            credentials: {
                accessKeyId: 'AKIA2DVZ6WJL2FX3Y35G',
                secretAccessKey: process.env.AWS_SECRET_ACCESSKEY
            },
        });
        try {
            //TODO : 버킷 생성하는 로직임 한번생성하고나면 버킷이 생성 되었기때문에 불필요해져서 주석처리
            // const upload = await new AWS.S3()
            //     .createBucket({
            //         Bucket: "seungseoknumbereats"
            //     })
            //     .promise();

            const objectName = `${Date.now() + file.originalname}`
            await new AWS.S3()
                .putObject({
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                    Key: objectName,
                    ACL: 'public-read'
                })
                .promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return {
                url
            }
        } catch (e) {
            return null;
        }

    }
}