import app from '../../server/index-prisma.js';

export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}


