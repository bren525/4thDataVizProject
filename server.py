from bottle import route, run, template
import sqlite3

conn = sqlite3.connect('./datasets/mortality.db')
c = conn.cursor()
# for row in c.execute("SELECT year,Cause_Recode_39,AVG(Age_Value) AS 'avg' from mortality GROUP BY year,Cause_Recode_39"):
#         print row

for row in c.execute("SELECT Age_Value,Cause_Recode_39,COUNT(1) from mortality GROUP BY Age_Value, Cause_Recode_39"):
        print row
# @route('/test')
# def test():
#     c.execute("SELECT AVG(Age_Value) from mortality where year="2003")
#     columns = dict([(c.description[i][0],i) for i in range(len(c.description))])
#     print columns
#     
#     return c.fetchone()

# @route('/hello/<name>')
# def hello(name):
#     return template('<b>Hello {{name}}</b>!', name=name)

# run(host='localhost', port=8080)