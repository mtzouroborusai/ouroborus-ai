import json

with open("cuestionario_ordenado.json", "r", encoding="utf-8") as f:
    data = json.load(f)

ids = [q['id'] for q in data]
missing = []
for i in range(1, 281):
    if i not in ids:
        missing.append(i)

print(f"Total questions: {len(ids)}")
print(f"Missing IDs: {missing}")
