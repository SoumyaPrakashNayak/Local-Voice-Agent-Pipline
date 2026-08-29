import sqlite3
conn = sqlite3.connect("crimelens.db")
cur = conn.cursor()
cur.execute("""
    SELECT fir_number FROM entities WHERE value = 'MH-04-XT-2291'
""")
print(cur.fetchall())  # should show FIR-541, FIR-542, FIR-301