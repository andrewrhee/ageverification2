import mongoose from 'mongoose';
import { Router } from 'express';
import Restaurant from '../model/restaurant';

export default({ config, db }) => {
  let api = Router();

  // '/v1/restaurant/add'
  api.post('/add', (res, req) => {
    let newRest = new Restaurant();

    
  });
}
