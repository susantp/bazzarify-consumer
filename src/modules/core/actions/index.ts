"use server";

export async function actionDeleteUser(
  prevState: { status: number; message: string },
  formData: FormData,
) {
  const phone = formData.get("phone") as string;

  if (!phone) {
    return {
      status: 404,
      message: "Phone number not provided.",
    };
  }

  if (phone.length !== 10) {
    return {
      status: 400,
      message: "Invalid phone number. Must be 10 digits.",
    };
  }

  // If everything is okay
  return {
    status: 200,
    message: `Account associated with ${phone} deletion process started.`,
  };
}
