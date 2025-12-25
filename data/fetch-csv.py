import requests

LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_fq8joAaG_cHXYtxcjqIwiAFEJ63Yc0BNNtu_X7ZlAy2WV4uA0HW9GEfIQctZXilC6ZItmXoTTQko/pub?gid=0&single=true&output=csv"
with open("data/definitions.csv", "w") as f:
   f.write(requests.get(LINK).content.decode("utf8").replace("\r\n", "\n"))
