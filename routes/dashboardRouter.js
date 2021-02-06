const router = require("express").Router();

const {
  dashboardGetController,
  createProfileGetController,
  createProfilePostController,
  editProfileGetController,
  editProfilePostController,
  bookmarksGetController,
  commentsGetController,
  changePasswordGetController,
  changePasswordPostController
} = require("../controllers/dashboardController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const profileValidator = require('../validator/dashboard/profileValidator')
const changePasswordValidator = require('../validator/auth/changePasswordValidator');

router.get("/change-password", isAuthenticated, changePasswordGetController);
router.post("/change-password", isAuthenticated, changePasswordValidator, changePasswordPostController);

router.get("/comments", isAuthenticated, commentsGetController);

router.get("/bookmarks", isAuthenticated, bookmarksGetController);

router.get("/create-profile", isAuthenticated, createProfileGetController);
router.post("/create-profile", isAuthenticated, profileValidator, createProfilePostController);

router.get("/edit-profile", isAuthenticated, editProfileGetController);
router.post("/edit-profile", isAuthenticated, profileValidator, editProfilePostController);

router.get("/", isAuthenticated, dashboardGetController);

module.exports = router;
