import { Response } from 'express';

export default function respond(
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
