import axios from "axios";

export async function dataCleaningPipeline(file_uuid: string) {
  try {
    const response = await axios.post(
      `http://localhost:8001/data-cleaning-pipeline?file_uuid=${file_uuid}`,
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
  } catch (error) {
    console.error("Error:", error);
  }
}
