const apiUrl =
  process.env.API_URL || "http://local-ne.bazzarify.local:8081/api/v1";
const appKey = process.env.APP_KEY || "";

export async function GET() {
  try {
    const res = await fetch(apiUrl.concat("/core/scan/download-android-app"), {
      headers: {
        "User-Agent": "BazzarifyConsumer",
        "Content-Type": "application/json",
        "X-APP-Key": appKey,
      },
    });
    const data = await res.json();

    if (!data?.metaData?.error) {
      return Response.redirect(data.data.payload["redirectUrl"]);
    }
    return Response.json({ error: data.metaData.error });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "An error occurred" });
  }
}
