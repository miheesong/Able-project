import os
from flask import Blueprint, render_template, redirect, url_for, request, send_from_directory
import pandas as pd
import math
user_route = Blueprint('user_route', __name__)
img_dir = './app/main/static/image/'
rank = pd.read_csv('./app/main/static/files/rank.csv')
board = pd.read_csv('./app/main/static/files/board.csv')
board = board.fillna('')
facility = pd.read_csv('./app/main/static/files/facility.csv')
@user_route.route('/', methods=['GET', 'POST'])
def main():

  main_rank = rank.copy()
  main_rank = main_rank.sort_values(by=['DMAND_MVM_ITEM_IDEX_RANK_CO'], ascending=[True]).head(10)
  main_board = board.copy()
  main_board = main_board.loc[[22, 36, 49, 57],['CLUB_NM', 'OPER_TIME_CN', 'CLUB_INTRCN_CN']]
  main_board.index=[1, 2, 3, 4]
  column_list = ['CLUB_NM', 'OPER_TIME_CN', "CLUB_INTRCN_CN"]
  return render_template('index.html', title="메인", rank=main_rank, board=main_board, column_list=column_list)


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

  return render_template('club.html', title="동호회", club_info=club_info, start=start, last=last, total_page=total_page, page=page)


@user_route.route('/facility',methods=['GET','POST'])
def find_facility():
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
  for i in range(0,len(phone)):
    phone.iloc[i] = str(phone.iloc[i])

    if(phone.iloc[i] !='0'):
      phone.iloc[i] = phone.iloc[i].zfill(len(phone.iloc[i])+1)
    else:
      phone.iloc[i] = ''

  phone = pd.DataFrame(phone, columns=['RPRSNTV_TEL_NO']);

  #print(phone)
  #목록 뿌려주기

  list = data[['FCLTY_NM','FCLTY_ROAD_NM_ADDR','CTPRVN_NM', 'SIGNGU_NM']]
  list = list.join((phone)) #데이터 프레임끼리 열병합
  list = list.sort_values(by='FCLTY_NM')
  #print(list)

  if request.method == "POST":
    sidogungu = request.get_json()
    list = list[(list['CTPRVN_NM'] == sidogungu['sido']) & (list['SIGNGU_NM'] == sidogungu['sigungu'])]
    print(list)
    return "dddd"

  return render_template('facility.html', province=province, country=country, list=list)