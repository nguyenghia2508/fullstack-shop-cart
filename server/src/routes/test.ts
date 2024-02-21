import dotenv from 'dotenv';
import express, { Request, Response, NextFunction,Router } from 'express';
import getTime from "../public/js/getTime"
import { validationResult } from 'express-validator';
import addValidator from '../middleware/validate/addValidator';
import updateValidator from '../middleware/validate/updateValidator';
import addTypeValidator from '../middleware/validate/addTypeValidator';
import updateTypeValidator from '../middleware/validate/updateTypeValidator';
import addTransactionValidator from '../middleware/validate/addTransactionValidator';
import multer, { FileFilterCallback } from 'multer';
import { storage, destroyCloudinary, renameCloudinary } from '../storage/storage';
import fs from 'fs';
import path from 'path';
import Rating from '../models/Rating';
import Product from '../models/Product';
import User from '../models/User';
import { ObjectId } from 'mongodb';
import Categories from '../models/Categories';
import Transactions from '../models/Transactions';
import { spawn } from 'child_process';

dotenv.config();

const router = Router();

router.get("/test-file", (req:Request,res:Response,next:NextFunction ) =>{
    const pythonProcess = spawn('python', [path.join(process.cwd(), "src/a.py")]);
    let responseData = '';
      const onDataReceived = (data: { toString: () => string; }) => {
          responseData += data.toString(); // Nối dữ liệu từ buffer
      };

      const onProcessClose = async (code: any) => {
          try {
              const parsedData = JSON.parse(responseData); // Phân tích chuỗi JSON
            return res.status(200).json({ parsedData,path:path.join(process.cwd())}); // Trả về một mảng rỗng nếu không có dữ liệu được phân tích
          } catch (error) {
              console.error('Error parsing Python response:', error);
              return res.status(500).json({
                  param: 'recommend',
                  msg: 'Error parsing Python response'
              });
          }
      };

      const onErrorReceived = (data: any) => {
          console.error(`stderr: ${data}`);
          // Xử lý lỗi và gửi phản hồi lỗi chỉ một lần
          if (!res.headersSent) {
              res.status(500).json({
                  param: 'recommend',
                  msg: 'Something went wrong with the Python process'
              });
          }
      };

      pythonProcess.stdout.on('data', onDataReceived);
      pythonProcess.on('close', onProcessClose);
      pythonProcess.stderr.on('data', onErrorReceived);
})

module.exports = router