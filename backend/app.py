from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pywhatkit as kit
import time

app = Flask(__name__)
CORS(app)

@app.route("/send-bulk", methods=["POST"])
def send_bulk():
    try:
        data = request.get_json()
        contacts = data.get("contacts", [])

        for person in contacts:
            name = person["name"]
            number = person["number"]
            message = person["message"].replace("{name}", name)

            # Send message (pywhatkit requires open browser)
            kit.sendwhatmsg_instantly(f"+91{number}", message, wait_time=10)
            time.sleep(5)  # Delay between messages

        return jsonify({"status": "success", "message": "Messages sent!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
