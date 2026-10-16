import express from "express";

import { type User, userSanitizer } from "../../models/users.models.js";
import { sanitizedDataIsFailure } from "../../utils/sanitization/sanitization.js";
import usersController from "../../controllers/users/users.controllers.js";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post("/", usersController.createUser);

export default router;