import { Router } from 'express';
import {
    saveUserInforamtion,
    getUserInformation,
    getAllUserInformation,
    deleteAlluser
} from "../controllers/user/user.controller.js";

const router = Router();

router.route('/save').post(saveUserInforamtion);
router.route('/get/:_id').get(getUserInformation);  
router.route('/getAll').get(getAllUserInformation);
router.route('/deleteAll').delete(deleteAlluser)


export const user_router = router;