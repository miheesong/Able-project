import sqlite3

conn = sqlite3.connect('database.db')
print('데이터베이스 생성 성공!')

conn.execute(
	'''
	create table user (userId INTEGER PRIMARY KEY, userPwd text)
	'''
)
conn.execute(
	'''
	create table club_board (bdid INTEGER PRIMARY KEY AUTOINCREMENT, bdTitle text, bdContent text, insertDate text, category text, userId text)
	'''
)
conn.execute(
	'''
	create table comments (bdid, content text, insertId text, insertDate text)
	'''
)
print('테이블 생성 성공!')



conn.close()

