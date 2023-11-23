from ai import getEmbedding
from dotenv import load_dotenv
import psycopg
import os


aws_rds = os.environ["DATABASE_URL"]
neon_db = os.environ["NEON_DB"]


def insert_db(videoId, content):
    with psycopg.connect(aws_rds) as conn:
        conn.execute(
            """
                CREATE TABLE if not exists transcripts (
                    id serial PRIMARY KEY,
                    videoId varchar(100),
                    content text[][],
                    createdAt timestamp NOT NULL DEFAULT NOW())
                """
        )

        conn.execute(
            "INSERT INTO transcripts (videoId, content) VALUES (%s, %s)",
            (videoId, content),
        )
        conn.commit()
    return 'insert done'


def query_db(videoId):
    with psycopg.connect(aws_rds) as conn:
        res = conn.execute(
                f"SELECT content FROM transcripts WHERE videoid = '{videoId}' "
            ).fetchall()
        # id = conn.execute(
        #     f"SELECT videoid FROM transcripts where videoid = '{videoId}'"
        # ).fetchall()
        if res == []:
            return
        else:
            # res = conn.execute(
            #     f"SELECT content FROM transcripts WHERE videoid = '{videoId}' "
            # ).fetchall()

            return res[0][0]
        

def getMatchesFromEmbeddings(query, videoId):
    with psycopg.connect(aws_rds) as conn:
        queryEmbedding = getEmbedding(query)

        res = conn.execute(
            f"SELECT content FROM yt_emb WHERE videoId = '{videoId}' ORDER BY embeding <=> '{queryEmbedding}' LIMIT 3"
        ).fetchall()

        conn.commit()

    content = ""
    for i in res:
        content += i[0]
    content

    return content


def insertEmbeddingTodb(videoId):
    """This should be run after already have transcript"""
    with psycopg.connect(aws_rds) as conn:
        id = conn.execute(
            f"SELECT videoid FROM yt_emb where videoid = '{videoId}'"
        ).fetchall()
        if id != []:
            return
        found = query_db(videoId)

        conn.execute("CREATE EXTENSION if not exists vector")
        conn.execute(
            """
            CREATE TABLE if not exists yt_emb (
                id serial PRIMARY KEY,
                videoId varchar(50),
                content text,
                embeding vector(1536))
            """
        )
        time = 1
        sentence = ""
        if found:
            for sen in found:
                sentence += sen[2]
                if float(sen[1]) > time * 60:
                    temp = " TIMESTAMP=" + sen[1]
                    sentence += temp
                    time += 1
                    vector = getEmbedding(sentence)
                    conn.execute(
                        "INSERT INTO yt_emb (videoId, content,embeding) VALUES (%s, %s, %s)",
                        (videoId, sentence, vector),
                    )
        else:
            print("No transcript, something wrong")

        conn.commit()

def createChat(videoId, userId):
    with psycopg.connect(neon_db) as conn:
        print('Inside neon_db')
        #     id = conn.execute(
        #         f'SELECT "videoId" FROM chats WHERE "videoId" = \'{_videoId}\' '
        #     ).fetchall()
        #     if id == []:
        #         # return "already exits"

        #         print(_videoId)
        #         print(_userId)
        #         insertEmbeddingTodb(_videoId)
        #     # else:
        #     # with psycopg.connect(neon_db) as conn:
        res = conn.execute(
            'INSERT INTO chats ("videoId", "user_id") VALUES (%s, %s) RETURNING id',
            (videoId, userId),
        ).fetchall()
        #     # res = conn.execute(
        #     #     f"SELECT id FROM yt_emb WHERE \"videoId\" = '{_videoId}' "
        #     # ).fetchall()
        conn.commit()
    return res

def getMatchesFromEmbeddings(query, videoId):
    with psycopg.connect(aws_rds) as conn:
        queryEmbedding = getEmbedding(query)

        res = conn.execute(
            f"SELECT content FROM yt_emb WHERE videoId = '{videoId}' ORDER BY embeding <=> '{queryEmbedding}' LIMIT 3"
        ).fetchall()

        conn.commit()

    content = ""
    for i in res:
        content += i[0]
    content

    return content