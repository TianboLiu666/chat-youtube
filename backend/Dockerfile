FROM ubuntu:22.04
#python:3.11-alpine as build

RUN apt-get update -y
RUN apt-get install python3.11 python3-pip -y
WORKDIR /code

RUN apt-get install pkg-config -y
COPY ./requirements.txt /code/requirements.txt
# COPY ../.env 
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP index.py
ENV FLASK_ENV development
ENV FLASK_RUN_PORT=8000
# ENV FLASK_RUN_HOST 127.0.0.1
ENV FLASK_RUN_HOST=0.0.0.0

EXPOSE 8000

# CMD python3 index.py
# CMD python3 -m flask --app index run -h 0.0.0.0 -p 8000
# CMD [ "python3", "-m" , "flask", "--app", "index" "run", "--host=0.0.0.0", "--port", "8000"]
CMD ["flask", "run", "-h", "0.0.0.0", "-p", "8000"]
# CMD flask run -h 0.0.0.0 -p 8000