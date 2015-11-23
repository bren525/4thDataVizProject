from bottle import route, run, static_file
import sqlite3
import json

conn = sqlite3.connect('./datasets/mortality.db')
c = conn.cursor()

@route('/test')
def test():
    data = {
        "avgAgeForCause":{
            "2003":{},
            "2008":{},
            "2013":{},
        },
        "numberOneCauseAtAge":{
            "2003":{},
            "2008":{},
            "2013":{},
        }
    }
    for row in c.execute("SELECT year,Cause_Recode_39,AVG(Age_Value) as avg from mortality GROUP BY year,Cause_Recode_39"):
        data["avgAgeForCause"][row[0]][row[1]] = row[2]

    for row in c.execute("SELECT year,Age_Value, Cause_Recode_39, MAX(c) as max FROM (SELECT year,Age_Value,Cause_Recode_39,COUNT(1) as c from mortality GROUP BY year, Age_Value, Cause_Recode_39) t GROUP BY year, Age_Value"):
        data["numberOneCauseAtAge"][row[0]][row[1]] = row[3]
    print json.dumps(data)
    return json.dumps(data)

data = []
jsonData = ''
for row in c.execute("""
    SELECT year,
        CASE
            WHEN CAST(Age_Value as int) BETWEEN 0 AND 9 then '0-9'
            WHEN CAST(Age_Value as int) BETWEEN 10 AND 19 THEN '10-19'
            WHEN CAST(Age_Value as int) BETWEEN 20 AND 29 THEN '20-29'
            WHEN CAST(Age_Value as int) BETWEEN 30 AND 39 THEN '30-39'
            WHEN CAST(Age_Value as int) BETWEEN 40 AND 49 THEN '40-49'
            WHEN CAST(Age_Value as int) BETWEEN 50 AND 59 THEN '50-59'
            WHEN CAST(Age_Value as int) BETWEEN 60 AND 69 THEN '60-69'
            WHEN CAST(Age_Value as int) BETWEEN 70 AND 79 THEN '70-79'
            WHEN CAST(Age_Value as int) BETWEEN 80 AND 89 THEN '80-89'
            WHEN CAST(Age_Value as int) BETWEEN 90 AND 99 THEN '90-99'
            ELSE '100+'
        END as age_range,
    Cause_Recode_39,COUNT(1) AS c
    FROM mortality
    GROUP BY
        year,
        CASE
            WHEN CAST(Age_Value as int) BETWEEN 0 AND 9 then '0-9'
            WHEN CAST(Age_Value as int) BETWEEN 10 AND 19 THEN '10-19'
            WHEN CAST(Age_Value as int) BETWEEN 20 AND 29 THEN '20-29'
            WHEN CAST(Age_Value as int) BETWEEN 30 AND 39 THEN '30-39'
            WHEN CAST(Age_Value as int) BETWEEN 40 AND 49 THEN '40-49'
            WHEN CAST(Age_Value as int) BETWEEN 50 AND 59 THEN '50-59'
            WHEN CAST(Age_Value as int) BETWEEN 60 AND 69 THEN '60-69'
            WHEN CAST(Age_Value as int) BETWEEN 70 AND 79 THEN '70-79'
            WHEN CAST(Age_Value as int) BETWEEN 80 AND 89 THEN '80-89'
            WHEN CAST(Age_Value as int) BETWEEN 90 AND 99 THEN '90-99'
            ELSE '100+'
        END, Cause_Recode_39
"""):
    data.append({"year": row[0], "age": row[1], "cause": row[2], "count": row[3]})

jsonData = json.dumps(data)
print jsonData

@route('/data')
def data():
    return jsonData

@route('/<filename>')
def loadFile(filename):
    return static_file(filename, root = "")

run(host='localhost', port=8080)