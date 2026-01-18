import Joi from "joi";

export const linkDeviceSchema = Joi.object({
  deviceUid: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.empty": "Device UID is required",
    "any.required": "Device UID is required",
    "string.guid": "Device UID must be a valid UUID (v4)",
  }),

  profileId: Joi.number().optional().messages({
    "number.base": "Profile ID must be a number",
  }),

  uniqueName: Joi.string()
    .optional()
    .when("profileId", {
      is: Joi.exist(),
      then: Joi.string().optional(),
      otherwise: Joi.forbidden(), // uniqueName only allowed if profileId exists
    })
    .messages({
      "string.base": "Unique Name must be a string",
      "string.empty": "Unique Name cannot be empty",
      "any.unknown": "Unique Name is only allowed when Profile ID is provided",
    }),

  deviceNickName: Joi.string().optional().messages({
    "string.base": "Device Nickname must be a string",
    "string.empty": "Device Nickname cannot be empty",
  }),
});