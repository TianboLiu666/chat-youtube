from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from db import (
    insert_db,
    query_db,
    insertEmbeddingTodb,
    createChat,
    getMatchesFromEmbeddings,
)

from ai import download_yt

app = Flask(__name__)
CORS(app)


@app.route("/")
def hell_word():
    return "<p>Welcome to server<p>"


@app.route("/api/whisper2", methods=["GET", "POST"])
def whisper2():
    video_id = request.args.get("url")
    print(video_id)
    found = query_db(video_id)
    if found:
        print("found transcript, no need to do it again")

        def generate():
            for sen in found:
                yield f"data: {float(sen[0]):.2f} -> {float(sen[1]):.2f} : {sen[2]}\n\n"

    else:
        segments, _ = download_yt(video_id)

        def generate():
            content = []
            for segment in segments:
                yield f"data: [%.2fs -> %.2fs] %s\n\n" % (
                    segment.start,
                    segment.end,
                    segment.text,
                )
                content.append([str(segment.start), str(segment.end), segment.text])
            insert_db(video_id, content)
            print("insert successful")

    res = Response(generate(), mimetype="text/event-stream")
    res.headers["Content-Encoding"] = "none"
    res.headers["Cache-Control"] = "no-cache, no-transform"
    res.headers["Connenction"] = "keep-live"

    return res


@app.route("/api/create", methods=["POST"])
def create():
    _videoId = request.get_json()["videoId"]
    _userId = request.get_json()["userId"]

    insertEmbeddingTodb(_videoId)

    chatId = createChat(_videoId, _userId)
    print("success create chat")

    print(type(chatId))
    print(type(chatId[0]))
    print(type(chatId[0][0]))

    return str(chatId[0][0])  # Response(jsonify({"chatId": chatId}))


@app.route("/api/transcript", methods=["GET", "POST"])
def transcript():
    video_id = request.get_json()["videoId"]
    print(video_id)
    found = query_db(video_id)
    if found:
        print("Found transcript")
        return "Found"
    else:
        segments, info = download_yt(video_id)

        content = []
        for segment in segments:
            content.append([str(segment.start), str(segment.end), segment.text])
        ii = insert_db(video_id, content)
        print("insert successful")
        print(ii)
        return "Done"


@app.route("/api/getContext", methods=["POST"])
def getContext():
    print("get context")
    _videoId = request.get_json()["videoId"]
    _query = request.get_json()["query"]
    print(_videoId)
    print(_query)
    context = getMatchesFromEmbeddings(_query, _videoId)

    return context
