import axios from "axios";

export async function dataCleaningPipeline(file_uuid: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AI_BACKEND_URL}/data-cleaning-pipeline?file_uuid=${file_uuid}`,
      {},
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    const data = response.data;
    console.log(data);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}
