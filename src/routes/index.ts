import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to platform X Question-response Microservice!');
});

export default router;
