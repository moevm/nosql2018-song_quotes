FROM python:3.7.0b5-slim

WORKDIR /opt/back-end

ADD [".", "/opt/back-end"]

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 80

CMD ["python", "app.py"]
