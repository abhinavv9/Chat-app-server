const express = require("express");
const GroupController = require("../controllers/GroupController");
const { authenticateJWT } = require("../middlewares/auth");

const router = express.Router();

// Create a new group
router.post("/", authenticateJWT, GroupController.createGroup);

router.get("/", authenticateJWT, GroupController.getGroups);

router.post("/send-message", authenticateJWT, GroupController.sendGroupMessage);

// Add a user to a group
router.post(
  "/add-users",
  authenticateJWT,
  GroupController.addUserToGroup
);

// Fetch group messages
router.get(
  "/group-messages",
  authenticateJWT,
  GroupController.getGroupMessages
);

// Get group by ID
router.get("/:groupId", authenticateJWT, GroupController.getGroupById);

module.exports = router;
