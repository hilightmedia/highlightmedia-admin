import Joi from "joi";

export const EditProfileSchema = Joi.object({
  profileName: Joi.string().trim().required().messages({
    "string.empty": "Profile name is required.",
  }),
  firstName: Joi.string().trim().required().messages({
    "string.empty": "First name is required.",
  }),
  lastName: Joi.string().trim().required().messages({
    "string.empty": "Last name is required.",
  }),
  designation: Joi.string().trim().allow("").optional(),
  companyName: Joi.string().trim().allow("").optional(),
  companyAddress: Joi.string().trim().allow("").optional(),
  shortDescription: Joi.string().trim().allow("").optional(),
  address: Joi.string().trim().allow("").optional(),
  city: Joi.string().trim().allow("").optional(),
  zipCode: Joi.string().trim().allow("").optional(),
  state: Joi.string().trim().allow("").optional(),
  country: Joi.string().trim().allow("").optional(),

  // Phone numbers: 1 mandatory, max 2
  // phoneNumbers: Joi.array()
  //   .items(
  //     Joi.object({
  //       phoneNumberId: Joi.number().optional(),
  //       countryCode: Joi.string().required().messages({
  //         "string.empty": "Country code is required.",
  //       }),
  //       phoneNumber: Joi.string()
  //         .trim()
  //         .pattern(/^[0-9]{10,15}$/)
  //         .required()
  //         .messages({
  //           "string.empty": "Phone number is required.",
  //           "string.pattern.base": "Enter a valid phone number (10–15 digits).",
  //         }),
  //       phoneNumberType: Joi.string().allow("").optional(),
  //       checkBoxStatus: Joi.boolean().optional(),
  //       activeStatus: Joi.boolean().required(),
  //     })
  //   )
  //   .min(1)
  //   .max(2)
  //   .required(),

  // // Emails: 1 mandatory, max 2
  // emailIds: Joi.array()
  //   .items(
  //     Joi.object({
  //       emailIdNumber: Joi.number().optional(),
  //       emailId: Joi.string()
  //         .trim()
  //         .email({ tlds: { allow: false } })
  //         .required()
  //         .messages({
  //           "string.empty": "Email is required.",
  //           "string.email": "Enter a valid email address.",
  //         }),
  //       emailType: Joi.string().allow("").optional(),
  //       checkBoxStatus: Joi.boolean().optional(),
  //       activeStatus: Joi.boolean().required(),
  //     })
  //   )
  //   .min(1)
  //   .max(2)
  //   .required(),

  // // Websites: optional, max 2
  // websites: Joi.array()
  //   .items(
  //     Joi.object({
  //       websiteId: Joi.number().optional(),
  //       website: Joi.string().uri().allow(""),
  //       websiteType: Joi.string().allow(""),
  //       checkBoxStatus: Joi.boolean().optional(),
  //       activeStatus: Joi.boolean().optional(),
  //     })
  //   )
  //   .max(2)
  //   .optional(),

  // Social Media: optional
  // socialMediaNames: Joi.array()
  //   .items(
  //     Joi.object({
  //       profileSocialMediaLinkId: Joi.number().optional(),
  //       profileSocialMediaId: Joi.number().required(),
  //       socialMediaName: Joi.string().allow("").optional(),
  //       enableStatus: Joi.boolean().optional(),
  //       activeStatus: Joi.boolean().optional(),
  //     })
  //   )
  //   .optional(),

  // // Digital Payment Links: optional, max 3
  // digitalPaymentLinks: Joi.array()
  //   .items(
  //     Joi.object({
  //       profileDigitalPaymentLinkId: Joi.number().optional(),
  //       profileDigitalPaymentsId: Joi.number().allow(null, ""),
  //       digitalPaymentLink: Joi.string().allow(""), // optional, can be empty
  //       enableStatus: Joi.boolean().optional(),
  //       activeStatus: Joi.boolean().optional(),
  //     })
  //   )
    // .max(3)
    // .optional(),
}).unknown(true); // <- allows extra fields like darkMode, brandingFontColor etc.
