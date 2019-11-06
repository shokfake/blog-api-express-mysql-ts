import { Response } from 'express';

// eslint-disable-next-line import/prefer-default-export
export function respond(
  res: Response,
  status: number,
  data: any,
  contentType = 'application/json'
): void {
  res.writeHead(status, {
    'Content-Type': contentType
  });
  res.end(JSON.stringify(data));
}
