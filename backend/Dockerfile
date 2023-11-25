FROM python:3.11-slim-bullseye

# RUN apt-get update -y

WORKDIR /code

RUN apt-get update -y
RUN apt-get install pkg-config -y
COPY ./requirements.txt /code/requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP index.py
ENV FLASK_ENV development
ENV FLASK_RUN_PORT 8000
ENV FLASK_RUN_HOST 0.0.0.0

EXPOSE 8000

CMD ["python3", "index.py","run", "-h", "0.0.0.0", "-p", "8000"]
# CMD ["flask", "run", "-h", "0.0.0.0", "-p", "8000"]