import { Response } from 'express';

export const successSingleResponse = <T>(res: Response, response: T) => {
  return res.json({
    status: {
      code: 200,
      description: 'OK',
    },
    result: response,
  });
};

export const successResponse = <T>(res: Response, response: Array<T>) => {
  return res.json({
    status: {
      code: 200,
      description: 'OK',
    },
    result: response,
  });
};

export const successPagedResponse = <T>(
  res: Response,
  response: Array<T>,
  current_page: number,
  total_page: number,
  total_count: number
) => {
  return res.json({
    status: {
      code: 200,
      description: 'OK',
    },
    result: response,
    current_page: current_page,
    total_page: total_page,
    total_count: total_count,
  });
};

export const successCreateResponse = <T>(res: Response, response: T) => {
  return res.json({
    status: {
      code: 201,
      description: 'Data berhasil ditambah !',
    },
    result: response,
  });
};

export const successEditResponse = <T>(res: Response, response: T) => {
  return res.json({
    status: {
      code: 200,
      description: 'Data berhasil diedit !',
    },
    result: response,
  });
};

export const successDeleteResponse = <T>(res: Response, response: T) => {
  return res.json({
    status: {
      code: 200,
      description: 'Data berhasil dihapus !',
    },
    result: response,
  });
};
