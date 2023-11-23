import pytube as pt
import os
from faster_whisper import WhisperModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


client = OpenAI()

model_size = "small"
model = WhisperModel(model_size, device="cpu", compute_type="int8")


def download_yt(videoId: str):
    yt = pt.YouTube(f"https://www.youtube.com/watch?v={videoId}")
    stream = yt.streams.filter(only_audio=True)[0]
    stream.download(filename="/tmp/audio.mp3")
    segments, info = model.transcribe("/tmp/audio.mp3", beam_size=5)

    print(
        "Detected language '%s' with probability %f"
        % (info.language, info.language_probability)
    )

    return segments, info


def getEmbedding(text: str):
    data = client.embeddings.create(input=text, model="text-embedding-ada-002")
    return data.data[0].embedding
