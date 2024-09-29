from google.cloud import speech
import os

from google.oauth2 import service_account
from google.cloud import speech

def create_speech_client(credential_path):
    # Load the credentials from the provided JSON file path
    credentials = service_account.Credentials.from_service_account_file(credential_path)

    # Create the SpeechClient using the credentials
    client = speech.SpeechClient(credentials=credentials)

    return client

def transcribe_streaming(stream_file: str, credential_path: str) -> speech.RecognitionConfig:
    """Streams transcription of the given audio file using Google Cloud Speech-to-Text API.
    Args:
        stream_file (str): Path to the local audio file to be transcribed.
            Example: "resources/audio.raw"
    """
    # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/akshay/Documents/conxai/tutorials/genai-ex-datafusion/speech2text-436520-c906225b906f.json"
    client = create_speech_client(credential_path=credential_path)

    with open(stream_file, "rb") as audio_file:
        audio_content = audio_file.read()

    # In practice, stream should be a generator yielding chunks of audio data.
    stream = [audio_content]

    requests = (
        speech.StreamingRecognizeRequest(audio_content=chunk) for chunk in stream
    )

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    streaming_config = speech.StreamingRecognitionConfig(config=config)

    # streaming_recognize returns a generator.
    responses = client.streaming_recognize(
        config=streaming_config,
        requests=requests,
    )
    transcripts = []
    for response in responses:
        # Once the transcription has settled, the first result will contain the
        # is_final result. The other results will be for subsequent portions of
        # the audio.
        for result in response.results:
            print(f"Finished: {result.is_final}")
            print(f"Stability: {result.stability}")
            
            # The alternatives are ordered from most likely to least.
            if result.is_final:
                alternatives = result.alternatives
                for alternative in alternatives:
                    print(f"Confidence: {alternative.confidence}")
                    print(f"Transcript: {alternative.transcript}")
                    transcripts.append(alternative.transcript)

    return transcripts

