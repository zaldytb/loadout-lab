import requests
from bs4 import BeautifulSoup
import csv
import time
import re

URL = "https://twu.tennis-warehouse.com/cgi-bin/compareracquets.cgi"

# Step 1: Get all racquet names from the dropdown
resp = requests.get(URL)
soup = BeautifulSoup(resp.text, "html.parser")
select_a = soup.find("select", {"name": "A"})  # or id="A"
racquets = []
for opt in select_a.find_all("option"):
    val = opt.get("value", opt.text.strip())
    if val and "Choose" not in val:
        racquets.append(val)

print(f"Found {len(racquets)} racquets")

# Step 2: For each racquet, request comparison and parse Racquet A column
ANCHOR = racquets[0]  # fix B to first racquet, doesn't matter which
PROPS = [
    "headsize_in", "headsize_cm",
    "length_in", "length_cm",
    "weight_oz", "weight_gm",
    "balance_in", "balance_cm",
    "swingweight",
    "flex_rdc",
    "twistweight",
    "vibration_hz",
    "power_pct",
    "sweetzone_in2", "sweetzone_cm2",
]

results = []

for i, racquet in enumerate(racquets):
    try:
        params = {"A": racquet, "B": ANCHOR}
        r = requests.get(URL, params=params, timeout=15)
        s = BeautifulSoup(r.text, "html.parser")

        # Find the comparison table - it has "Property" in first header
        table = None
        for t in s.find_all("table"):
            if t.find("td", string=re.compile("Property")):
                table = t
                break

        if not table:
            print(f"[{i}] SKIP no table: {racquet}")
            continue

        rows = table.find_all("tr")
        data = {"name": racquet}

        # rows[0] = header, rows[1:] = data rows
        # Each data row: [Property, Racquet A val, Racquet B val, Diff%]
        for row in rows[1:]:
            cells = row.find_all("td")
            if len(cells) < 3:
                continue
            prop = cells[0].get_text(strip=True)
            val_a = cells[1].get_text(separator="|", strip=True)

            # Parse based on property name
            if "Headsize" in prop:
                parts = val_a.split("|")
                data["headsize_in"] = parts[0].strip() if len(parts) > 0 else ""
                data["headsize_cm"] = parts[1].strip() if len(parts) > 1 else ""
            elif "Length" in prop:
                parts = val_a.split("|")
                data["length_in"] = parts[0].strip() if len(parts) > 0 else ""
                data["length_cm"] = parts[1].strip() if len(parts) > 1 else ""
            elif "Weight" in prop:
                parts = val_a.split("|")
                data["weight_oz"] = parts[0].strip() if len(parts) > 0 else ""
                data["weight_gm"] = parts[1].strip() if len(parts) > 1 else ""
            elif "Balance" in prop:
                parts = val_a.split("|")
                data["balance_in"] = parts[0].strip() if len(parts) > 0 else ""
                data["balance_cm"] = parts[1].strip() if len(parts) > 1 else ""
            elif "Swingweight" in prop:
                data["swingweight"] = val_a
            elif "Flex" in prop:
                data["flex_rdc"] = val_a
            elif "Twistweight" in prop:
                data["twistweight"] = val_a
            elif "Vibration" in prop:
                data["vibration_hz"] = val_a
            elif "Power" in prop:
                data["power_pct"] = val_a
            elif "Sweet" in prop:
                parts = val_a.split("|")
                data["sweetzone_in2"] = parts[0].strip() if len(parts) > 0 else ""
                data["sweetzone_cm2"] = parts[1].strip() if len(parts) > 1 else ""

        results.append(data)
        if i % 50 == 0:
            print(f"[{i}/{len(racquets)}] {racquet}")

        time.sleep(0.3)  # be polite to server

    except Exception as e:
        print(f"[{i}] ERROR {racquet}: {e}")
        continue

# Step 3: Write to CSV
fieldnames = ["name"] + PROPS
with open("twu_racquet_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(results)

print(f"\nDone. {len(results)} racquets saved to twu_racquet_data.csv")