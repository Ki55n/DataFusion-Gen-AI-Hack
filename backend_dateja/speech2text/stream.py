import os, logging
import google
from google.cloud import speech
import asyncio
# from google.oauth2 import service_account
# speech2text_filename = ""
# credentials = service_account.Credentials.from_service_account_file(filename=speech2text_filename)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/akshay/Documents/conxai/tutorials/genai-ex-datafusion/speech2text-436520-c906225b906f.json"

client = speech.SpeechClient()

# config = speech.RecognitionConfig(
#     encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#     sample_rate_hertz=16000,
#     language_code="en-US",
# )

# streaming_config = speech.StreamingRecognitionConfig(
#     config=config, interim_results=True
# )

# def stream_audio_to_text(audio_generator):
#     requests = (
#         speech.StreamingRecognizeRequest(audio_content=content)
#         for content in audio_generator
#     )

#     responses = client.streaming_recognize(streaming_config, requests)

#     for response in responses:
#         for result in response.results:
#             yield result.alternatives[0].transcript

##


config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code="en-US",
)

streaming_config = speech.StreamingRecognitionConfig(
    config=config, interim_results=True
)

async def stream_audio_to_text(audio_generator):
    async def request_generator():
        async for content in audio_generator:
            if content:
                yield speech.StreamingRecognizeRequest(audio_content=content)

    requests = request_generator()
    
    try:
        responses = await asyncio.to_thread(
            client.streaming_recognize, streaming_config, [request async for request in requests]
        )
        
        for response in responses:
            for result in response.results:
                # yield result.alternatives[0].transcript
                transcript = result.alternatives[0].transcript
                logging.debug(f"Transcribed: {transcript}")
                yield transcript                
    except Exception as e:
        logging.error(f"Error in stream_audio_to_text: {e}", exc_info=True)
        raise