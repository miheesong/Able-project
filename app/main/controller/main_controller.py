import os
from flask import Blueprint, render_template, redirect, url_for, request, send_from_directory, flash, session
import pandas as pd
import math
import numpy as np
import sqlite3 as sql
import datetime

user_route = Blueprint('user_route', __name__)
img_dir = './app/main/static/image/'
rank = pd.read_csv('./app/main/static/files/rank.csv')
board = pd.read_csv('./app/main/static/files/board.csv')
board = board.fillna('')
facility = pd.read_csv('./app/main/static/files/facility.csv')

@user_route.route('/', methods=['GET', 'POST'])
def main():
  if 'userid' in session:
    current_user = session['userid']
  else:
    current_user = None
  
  main_rank = rank.copy()
  main_rank = main_rank.sort_values(by=['DMAND_MVM_ITEM_IDEX_RANK_CO'], ascending=[True]).head(10)
  main_board = board.copy()
  main_board = main_board.loc[[22, 36, 49, 57],['CLUB_NM', 'OPER_TIME_CN', 'CLUB_INTRCN_CN']]
  main_board.index=[1, 2, 3, 4]
  column_list = ['CLUB_NM', 'OPER_TIME_CN', "CLUB_INTRCN_CN"]
  return render_template('index.html', title="메인", rank=main_rank, board=main_board, column_list=column_list, current_user=current_user)

@user_route.route('/login',methods=['GET', 'POST'])
def login():
  if request.method == 'POST':
    data = request.get_json()

    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("select * from user where userId=?",(data['id'],))
    rows = cur.fetchall()
    if data['pwd'] == rows[0][1]:
      response_object = {
        'status': 'success',
        'message': 'Successfully save.'
      }
      session.clear()
      session['userid'] = data['id']
      # print(session['userid'])
      return response_object, 200
      con.close()  # db 닫음.
    else:
      response_object = {
        'status': 'fail',
        'message': '다시 시도해주세요.'
      }
      return response_object, 200

  return render_template('login.html')

@user_route.route('/logout',methods=['GET'])
def logout():
  session.pop('userid', None)
  return redirect(url_for('user_route.main'))

@user_route.route('/register',methods=['GET','POST'])
def register():
  if request.method == "POST":
    id = request.form.get('id')
    pwd = request.form.get('pwd')
    confirm_pwd = request.form.get('confirm-pwd')

    if pwd != confirm_pwd:
      flash("비밀번호를 확인해주세요.")
      return render_template('register.html')
    else:
      try:
        with sql.connect("database.db") as con:
          # db 입력창에 입력커서 놓기.
          cur = con.cursor()

          # db에 값 입력. (메모리상 입력o, db에 입력x)
          cur.execute("INSERT INTO user (userId,userPwd) VALUES (?,?)", (id, pwd))

          con.commit()  # db에 값 저장. (데이터베이스에 입력됨.)
          msg = "Record successfully added"

      except:
        con.rollback()
        msg = "error in insert operation"

      finally:  # try를 하던 except을 하던 finally는 무조건 한번 실행됨.
        flash("회원가입이 되었습니다.")
        return redirect('/')  # 파이썬에 있는 msg객체를 result.html에 전달.
        con.close()  # db 닫음.

  else:
    return render_template('register.html')


@user_route.route('/boards/<string:clubNmTm>', methods=['GET'])
def club_detail(clubNmTm):
  data = board.copy()
  club = clubNmTm.split("+")
  new_data = data.loc[(data['CLUB_NM'] == club[0]) & (data['OPER_TIME_CN'] == club[1])]

  itemNm = new_data['ITEM_NM'].values[0]
  subNm = new_data['SUBITEM_NM'].values[0]

  # 이미지 파일 유무 확인
  imgNm = None
  if os.path.isfile(img_dir + itemNm + ".jpg"):
    imgNm = itemNm
  elif os.path.isfile(img_dir + subNm + ".jpg"):
    imgNm = subNm

  return render_template('board-detail.html', board=new_data.values, imgNm=imgNm)

@user_route.app_errorhandler(404)
def not_find(err):
  return render_template('common/404.html', title="404"), 404

@user_route.app_errorhandler(500)
def internal_error(err):
  return render_template('common/500.html', title="500"), 500

@user_route.route('/club')
@user_route.route('/club/')
@user_route.route('/club/p/<int:page>')
def club(page=1, start=1):
  if 'userid' in session:
    current_user = session['userid']
  else:
    current_user = None

  club_info = board.copy()
  club_info = club_info[['CTPRVN_NM', 'SIGNGU_NM', 'ITEM_NM', 'TROBL_TY_NM', 'CLUB_NM', 'OPER_TIME_CN']]
  club_info = club_info.fillna("-")

  data = request.args
  search_club = False
  conta1, conta2, club_name = True, True, True

  ## 검색
  if 'area' in data:
    conta1 = club_info['CTPRVN_NM'].str.contains(data['area'])
    search_club = True
  if 'sport' in data:
    conta2 = club_info['ITEM_NM'].str.contains(data['sport'])
    search_club = True
  if 'search_keyword' in data:
    club_name = club_info['CLUB_NM'].str.contains(data['search_keyword'])
    search_club = True

  if search_club:
    condi = conta1 & conta2 & club_name
    club_info = club_info[condi]

  ## 페이징
  start = int((page - 1) / 10) * 10 + 1
  last = start + 10
  total_page = int(math.ceil((club_info.shape[0]) / 10))

  club_info = club_info.iloc[(page * 10) - 10:(page * 10) - 1]

  return render_template('club.html', title="동호회", club_info=club_info, start=start, last=last, total_page=total_page, page=page, current_user=current_user)


@user_route.route('/board')
@user_route.route('/board/')
# @user_route.route('/club/p/<int:page>')
def club_board():
  con = sql.connect("database.db")
  cur = con.cursor()

  if 'userid' in session:
    current_user = session['userid']
  else:
    current_user = None

  ## 검색 부분
  data = request.args
  if data:

    keyword = data['search_keyword']
    cur.execute(
      'select bdid, bdTitle, substr(insertDate,0,11) as date, category, userId from club_board where (bdContent || bdTitle || userId || category) LIKE ? order by insertDate desc',
      ('%' +keyword + '%',))
    club_board = cur.fetchall()
    # club_board = cur.fetchall()

  else:
    cur.execute("select bdid, bdTitle, substr(insertDate,0,11) as date, category, userId from club_board order by insertDate desc")
    club_board = cur.fetchall()

  # print(club_board)
  return render_template('board.html', current_user=current_user, club_board=club_board)

@user_route.route('/board/upload/',methods=['GET','POST'])
def upload_board():
  if request.method == 'POST':
    data = request.get_json()

    con = sql.connect("database.db")
    cur = con.cursor()

    try:
      cur.execute("INSERT INTO club_board (bdTitle,bdContent, insertDate, category, userId) VALUES (?,?,?,?,?)",
                  (data['title'], data['content'], datetime.datetime.now(), data['type'], session['userid']))
      con.commit()  # db에 값 저장. (데이터베이스에 입력됨.)
      response_object = {
        'status': 'success',
        'message': 'Successfully save.'
      }

      return response_object, 200
      con.close()  # db 닫음.
    except Exception as e:
      print(e)
      response_object = {
        'status': 'fail',
        'message': 'club_board Create fail.',
      }
      return response_object, 500

  else:
    club_board = board.copy()
    club_board = club_board['TROBL_TY_NM']
    club_board = club_board.drop_duplicates()
    club_board.replace('', np.nan, inplace=True)
    club_board = club_board.dropna(axis=0)
  # print(club_board)
    return render_template('board_upload.html', club_board=club_board)

@user_route.route('/post/<int:bdid>', methods=['GET','POST'])
def post(bdid):

  if request.method == 'GET':
    con = sql.connect("database.db")
    cur = con.cursor()

    cur.execute("select bdid, bdTitle, bdcontent,substr(insertDate, 0, 11) as insertDate, category, userId from club_board where bdid=?",(bdid,))
    post = cur.fetchone()
    cur.execute("select content,substr(insertDate, 0, 11) as insertDate, insertId from comments where bdid=?",(bdid,))
    post_comments = cur.fetchall()

    con.close()  # db 닫음.

    return render_template('post-detail.html', post=post, current_user=session['userid'], post_comments=post_comments)
  else:
    data = request.get_json()

    con = sql.connect("database.db")
    cur = con.cursor()

    try:
      cur.execute("INSERT INTO comments (bdid,content, insertDate, insertId) VALUES (?,?,?,?)",
                  (data['bdid'], data['comment'], datetime.datetime.now(), session['userid']))
      con.commit()  # db에 값 저장. (데이터베이스에 입력됨.)
      response_object = {
        'status': 'success',
        'message': 'Successfully save.'
      }

      return response_object, 200
      con.close()  # db 닫음.
    except Exception as e:
      print(e)
      response_object = {
        'status': 'fail',
        'message': 'club_board Create fail.',
      }
      return response_object, 500

@user_route.route('/facility',methods=['GET'])
def find_facility():
  if 'userid' in session:
    current_user = session['userid']
  else:
    current_user = None

  # 검색부분 select
  data = pd.read_csv('./app/main/static/files/facility.csv')
  data = data.fillna(0)
  country = data[['CTPRVN_NM', 'SIGNGU_NM']]
  country = country.drop_duplicates(subset=['SIGNGU_NM','CTPRVN_NM'], keep='first')

  #print(country.shape)

  province = data.drop_duplicates(subset=['CTPRVN_NM'], keep='first')
  province = province['CTPRVN_NM'].sort_values()

  #print(pd.DataFrame(country))
  #print("----------------------")
  #print(pd.DataFrame(province).to_numpy())


  #폰 앞자리 0으로 채워주기

  phone = data['RPRSNTV_TEL_NO'].astype('int64') # int32는 자리수size가 10까지밖에 안됨

  #print(phone.head(200))
  i = 0
  for i in range(0, len(phone)):
    phone.iloc[i] = str(phone.iloc[i])

    if(phone.iloc[i] !='0'):
      phone.iloc[i] = phone.iloc[i].zfill(len(phone.iloc[i])+1)
    else:
      phone.iloc[i] = ''

  phone = pd.DataFrame(phone, columns=['RPRSNTV_TEL_NO']);

  print(phone)
  #목록 뿌려주기

  list = data[['FCLTY_NM','FCLTY_ROAD_NM_ADDR','CTPRVN_NM', 'SIGNGU_NM', 'FCLTY_CRDNT_LO', 'FCLTY_CRDNT_LA']]
  list = list.join((phone)) #데이터 프레임끼리 열병합
  list = list.sort_values(by='FCLTY_NM')

  return render_template('facility.html', province=province, country=country, list=list, current_user=current_user)




@user_route.route('/facility/list', methods=['GET'])
def search_facility():
  if 'userid' in session:
    current_user = session['userid']
  else:
    current_user = None

  data = pd.read_csv('./app/main/static/files/facility.csv')
  data = data.fillna(0)
  country = data[['CTPRVN_NM', 'SIGNGU_NM']]
  country = country.drop_duplicates(subset=['SIGNGU_NM', 'CTPRVN_NM'], keep='first')

  province = data.drop_duplicates(subset=['CTPRVN_NM'], keep='first')
  province = province['CTPRVN_NM'].sort_values()

  # print(pd.DataFrame(country))


  # 폰 앞자리 0으로 채워주기
  phone = data['RPRSNTV_TEL_NO'].astype('int64')  # int32는 자리수size가 10까지밖에 안됨

  i = 0
  for i in range(0, len(phone)):
    phone.iloc[i] = str(phone.iloc[i])
    if (phone.iloc[i] != '0'):
      phone.iloc[i] = phone.iloc[i].zfill(len(phone.iloc[i]) + 1)
    else:
      phone.iloc[i] = ''

  phone = pd.DataFrame(phone, columns=['RPRSNTV_TEL_NO']);

  # 목록 뿌려주기
  list = data[['FCLTY_NM', 'FCLTY_ROAD_NM_ADDR', 'CTPRVN_NM', 'SIGNGU_NM', 'FCLTY_CRDNT_LO', 'FCLTY_CRDNT_LA']]
  list = list.join((phone))  # 데이터 프레임끼리 열병합
  list = list.sort_values(by='FCLTY_NM')
  # print(list)

  get_data = request.args
  print(get_data)

  search_facility = False
  conta1, conta2 = True, True

  if 'sido' in get_data:
    conta1 = list['CTPRVN_NM'].str.contains(get_data['sido'])
    search_facility = True
  if 'sigungu' in get_data:
    conta2 = list['SIGNGU_NM'].str.contains(get_data['sigungu'])
    search_facility = True

  if search_facility:
    condi = conta1 & conta2
    list = list[condi]


  return render_template('facility.html', province=province, country=country, list=list, current_user=current_user)





