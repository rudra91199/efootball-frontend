export const getFaceCropUrl = (url) => {
  if (!url || typeof url !== "string") return "/placeholder.svg";

  if (url.includes("cloudinary.com")) {
    // If it already has our specific cropping, just return it
    if (url.includes("g_face") || url.includes("g_auto")) return url;

    // 1. Strip the old version number
    const cleanUrl = url.replace(/\/v\d+\//, '/');

    // 2. THE FIX: Changed c_fill to c_thumb so zoom (z) actually works!
    // z_0.7 zooms out (1.0 is default, anything lower zooms out). 
    // You can tweak 0.7 to 0.6 or 0.8 to get the perfect framing.
    const newUrl = cleanUrl.replace(
      "/image/upload/", 
      "/image/upload/c_thumb,g_face,z_0.7,w_200,h_200,q_auto,f_auto/"
    );

    // 3. THE CACHE BUSTER (Updated to 'trans2' to force it to refresh again)
    return newUrl.includes("?") ? `${newUrl}&v=trans2` : `${newUrl}?v=trans2`;
  }

  return url;
};