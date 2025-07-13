export const executeReCaptchaToken = async (
  action: string,
  executeRecaptcha: ((action: string) => Promise<string>) | undefined
): Promise<string | null> => {
  if (!executeRecaptcha) {
    console.warn("executeRecaptcha is not yet available");
    return null;
  }

  try {
    const token = await executeRecaptcha(action);
    console.log("reCAPTCHA token:", token);
    return token;
  } catch (error) {
    console.error("Error executing reCAPTCHA:", error);
    return null;
  }
};
