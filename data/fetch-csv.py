import requests

DEFS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_fq8joAaG_cHXYtxcjqIwiAFEJ63Yc0BNNtu_X7ZlAy2WV4uA0HW9GEfIQctZXilC6ZItmXoTTQko/pub?gid=0&single=true&output=csv"
with open("data/definitions.csv", "w") as f:
   f.write(requests.get(DEFS).content.decode("utf8").replace("\r\n", "\n").split("\n", 1)[1])
NOTES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_fq8joAaG_cHXYtxcjqIwiAFEJ63Yc0BNNtu_X7ZlAy2WV4uA0HW9GEfIQctZXilC6ZItmXoTTQko/pub?gid=2095643961&single=true&output=csv"
with open("data/notes.csv", "w") as f:
   f.write(requests.get(NOTES).content.decode("utf8").replace("\r\n", "\n"))
