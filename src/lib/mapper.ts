import { get } from "lodash";

export const ProductDetailMapper = (data: any) => {
  const productId = get(data, "productId", null);
  const name = get(data, "name", null);
  const shortDescription = get(data, "shortDescription", null);
  const originalPrice = Number(get(data, "originalPrice", 0)) || 0;
  const sellingPrice = Number(get(data, "sellingPrice", 0)) || 0;
  const deviceDescription = get(data, "deviceDescription", null);
  const productDetails = get(data, "productDetails", null);
  const primaryImage = get(data, "DeviceImageInventories[0].imageUrl", null);
  const secondaryImage = get(data, "DeviceImageInventories[1].imageUrl", null);
  const patternId = get(data, "patternId", null);
  const materialTypeId = get(data, "materialTypeId", null);
  const colorId = get(data, "colorId", null);
  const deviceType = get(data, "deviceType", null);
  const color = get(data, "color", "");
  const material = get(data, "material", "");
  const pattern = get(data, "pattern", "");
  const discountPercentage = Number(get(data, "discountPercentage", 0)) || 0;
  const deviceTypeId = get(data, "deviceTypeId", null);
  const availability = get(data, "availability", true);
  return {
    productId,
    name,
    shortDescription,
    originalPrice,
    sellingPrice,
    deviceDescription,
    productDetails,
    primaryImage,
    patternId,
    materialTypeId,
    colorId,
    deviceType,
    discountPercentage,
    color,
    material,
    pattern,
    secondaryImage,
    deviceTypeId,
    availability,
  };
};


export const ProfileMapper = (data: any) => {
  // Handle both cases: data.profile or flat data
  const base = get(data, "profile", data);

  const modeId = get(base, "ModeId", 2);
  const profileId = get(base, "id", null);
  const templateId = get(base, "TemplateId", 2);
  const address = get(base, "address", "");
  const firstName = get(base, "firstName", "");
  const lastName = get(base, "lastName", "");
  const companyName = get(base, "companyName", "");
  const designation = get(base, "designation", "");

  // Extract phones
  const phoneNumbers = get(base, "profilePhoneNumbers", []).map((p: any) => ({
    id: get(p, "id"),
    type: get(p, "phoneNumberType"),
    countryCode: get(p, "countryCode"),
    phoneNumber: get(p, "phoneNumber"),
    active: get(p, "activeStatus", false),
    isVisible: get(p, "checkBoxStatus", false),
  }));

  // Extract emails
  const emails = get(base, "profileEmails", []).map((e: any) => ({
    id: get(e, "id"),
    type: get(e, "emailType"),
    email: get(e, "emailId"),
    active: get(e, "activeStatus", false),
    isVisible: get(e, "checkBoxStatus", false),
  }));

  // Extract websites
  const websites = get(base, "profileWebsites", []).map((w: any) => ({
    id: get(w, "id"),
    url: get(w, "websiteUrl", ""),
    type: get(w, "websiteType", ""),
  }));

  // Extract social links
  const socialLinks = get(base, "profileSocialMediaLinks", []).map((s: any) => ({
    id: get(s, "id"),
    platform: get(s, "platform", ""),
    url: get(s, "link", ""),
  }));

  // Extract digital payment links
  const paymentLinks = get(base, "profileDigitalPaymentLinks", []).map((p: any) => ({
    id: get(p, "id"),
    platform: get(p, "platform", ""),
    link: get(p, "link", ""),
  }));

  return {
    modeId,
    profileId,
    templateId,
    address,
    firstName,
    lastName,
    companyName,
    designation,
    phoneNumbers,
    emails,
    websites,
    socialLinks,
    paymentLinks,
  };
};

