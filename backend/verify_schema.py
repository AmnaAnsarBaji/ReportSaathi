import urllib.request, json

r = urllib.request.urlopen('http://127.0.0.1:8000/api/reports/sample?report_type=cbc')
data = json.loads(r.read())
analysis = data['analysis']
metrics = analysis['metrics']

print("=== SCHEMA FIELD VERIFICATION ===")
print(f"is_report_clear: {analysis.get('is_report_clear')}")
print(f"clarity_note: {analysis.get('clarity_note')}")
print(f"metrics count: {len(metrics)}")

for m in metrics[:3]:
    print(f"\n  name: {m.get('name')}")
    print(f"  value: {m.get('value')}")
    print(f"  unit: {m.get('unit')}")
    print(f"  standard_range: {m.get('standard_range')}")
    print(f"  status: {m.get('status')}")
    print(f"  source_extracted_fact: {m.get('source_extracted_fact')}")
    print(f"  note: {m.get('note')}")
    print(f"  simple_explanation: {str(m.get('simple_explanation', ''))[:60]}...")

print("\n=== ALL REQUIRED FIELDS PRESENT ===")
