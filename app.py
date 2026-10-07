from flask import Flask, render_template, request, jsonify
from password_checker import check_password

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/check", methods=["POST"])
def api_check():
    data = request.get_json(silent=True) or {}

    password = data.get("password", "")

    if not isinstance(password, str):
        return jsonify({
            "error": "Password must be a string."
        }), 400

    result = check_password(password)

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=3001,
        debug=True
    )